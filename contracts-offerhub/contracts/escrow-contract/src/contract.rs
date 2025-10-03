use soroban_sdk::{log, Address, Env, IntoVal, String, Symbol, Vec};

use crate::storage::{
    check_rate_limit, increment_escrow_transaction_count, reset_rate_limit as rl_reset,
    set_escrow_transaction_count, set_rate_limit_bypass_flag,
};
use crate::{
    error::handle_error,

    storage::{ESCROW_DATA, INITIALIZED, add_call_log, CallLog, CONTRACT_CONFIG, 
              DEFAULT_MIN_ESCROW_AMOUNT, DEFAULT_MAX_ESCROW_AMOUNT, DEFAULT_TIMEOUT_DAYS,
              DEFAULT_MAX_MILESTONES, DEFAULT_FEE_PERCENTAGE, DEFAULT_RATE_LIMIT_CALLS,
              DEFAULT_RATE_LIMIT_WINDOW_HOURS, PAUSED},
    types::{DisputeResult, EscrowData, Milestone, MilestoneHistory, ContractConfig},
    validation::{validate_init_contract, validate_init_contract_full, validate_add_milestone, validate_milestone_id, validate_address},

    types::{
        EscrowDataExport, EscrowState, EscrowSummary
    },
    error::Error,
};

const TOKEN_TRANSFER: &str = "transfer";
const TOKEN_BALANCE: &str = "balance";
const MAX_AGE: u64 = 365 * 24 * 60 * 60; // 1 year in seconds 31_536_000

pub fn initialize_contract(env: &Env, admin: Address) {
    if env.storage().instance().has(&CONTRACT_CONFIG) {
        handle_error(env, Error::AlreadyInitialized);
    }
    
    admin.require_auth();
    
    let contract_config = ContractConfig {
        min_escrow_amount: DEFAULT_MIN_ESCROW_AMOUNT,
        max_escrow_amount: DEFAULT_MAX_ESCROW_AMOUNT,
        default_timeout_days: DEFAULT_TIMEOUT_DAYS,
        max_milestones: DEFAULT_MAX_MILESTONES,
        fee_percentage: DEFAULT_FEE_PERCENTAGE,
        rate_limit_calls: DEFAULT_RATE_LIMIT_CALLS,
        rate_limit_window_hours: DEFAULT_RATE_LIMIT_WINDOW_HOURS,
    };
    
    env.storage().instance().set(&CONTRACT_CONFIG, &contract_config);
    env.storage().instance().set(&PAUSED, &false);
    
    env.events().publish(
        (Symbol::new(env, "contract_initialized"), admin),
        env.ledger().timestamp(),
    );
}

pub fn is_paused(env: &Env) -> bool {
    env.storage().instance().get(&PAUSED).unwrap_or(false)
}

pub fn pause(env: &Env, admin: Address) -> Result<(), Error> {
    admin.require_auth();
    let escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap_or_else(|| handle_error(env, Error::NotInitialized));
    if escrow.client != admin {
        return Err(Error::Unauthorized);
    }
    
    if is_paused(env) {
        return Err(Error::AlreadyPaused);
    }
    
    env.storage().instance().set(&PAUSED, &true);
    
    env.events().publish(
        (Symbol::new(env, "contract_paused"), admin),
        env.ledger().timestamp(),
    );
    
    Ok(())
}

pub fn unpause(env: &Env, admin: Address) -> Result<(), Error> {
    admin.require_auth();
    let escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap_or_else(|| handle_error(env, Error::NotInitialized));
    if escrow.client != admin {
        return Err(Error::Unauthorized);
    }
    
    if !is_paused(env) {
        return Err(Error::NotPaused);
    }
    
    env.storage().instance().set(&PAUSED, &false);
    
    env.events().publish(
        (Symbol::new(env, "contract_unpaused"), admin),
        env.ledger().timestamp(),
    );
    
    Ok(())
}


// Emergency withdrawal function
pub fn emergency_withdraw(env: &Env, admin: Address) -> Result<(), Error> {
    admin.require_auth();
    
    if !is_paused(env) {
        return Err(Error::NotPaused);
    }
    
    let mut escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap_or_else(|| handle_error(env, Error::NotInitialized));
    
    if escrow_data.client != admin && escrow_data.freelancer != admin {
        return Err(Error::Unauthorized);
    }
    
    if escrow_data.state == EscrowState::Released || escrow_data.state == EscrowState::Refunded {
        return Err(Error::InvalidStatus);
    }
    
    if let (Some(token), amount) = (escrow_data.token.clone(), escrow_data.amount) {
        let contract_addr = env.current_contract_address();
        let half = amount / 2;
        
        env.invoke_contract::<()>(
            &token,
            &Symbol::new(env, TOKEN_TRANSFER),
            (contract_addr.clone(), escrow_data.client.clone(), half).into_val(env),
        );
        env.invoke_contract::<()>(
            &token,
            &Symbol::new(env, TOKEN_TRANSFER),
            (contract_addr, escrow_data.freelancer.clone(), amount - half).into_val(env),
        );
        
        escrow_data.state = EscrowState::Released;
        escrow_data.dispute_result = DisputeResult::Split as u32;
        escrow_data.resolved_at = Some(env.ledger().timestamp());
        escrow_data.released_at = Some(env.ledger().timestamp());
        
        env.storage().instance().set(&ESCROW_DATA, &escrow_data);
        
        env.events().publish(
            (Symbol::new(env, "emergency_withdrawal"), admin),
            (escrow_data.amount, env.ledger().timestamp()),
        );
        
        let total_escrow_transaction = increment_escrow_transaction_count(env);
        env.events().publish(
            (Symbol::new(env, "escrow_tx_count"),),
            total_escrow_transaction,
        );
    }
    
    Ok(())
}


// Helper function to log function calls
fn log_function_call(env: &Env, function_name: &str, caller: &Address, success: bool) {
    let log = CallLog {
        function_name: String::from_str(env, function_name),
        caller: caller.clone(),
        timestamp: env.ledger().timestamp(),
        success,
        gas_used: 0, // Soroban doesn't provide gas_used method
        transaction_hash: String::from_str(env, "unknown"), // Soroban doesn't provide transaction_hash method
    };

    add_call_log(env, &log);
}

pub fn init_contract_full(
    env: &Env,
    client: Address,
    freelancer: Address,
    arbitrator: Address,
    token: Address,
    amount: i128,
    timeout_secs: u64,
) {
    let caller = client.clone();

    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    // Log function call start
    log_function_call(env, "init_contract_full", &caller, true);

    if env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::AlreadyInitialized);
    }


    // Validate timeout_secs timestamp
    if let Err(e) = validate_timestamp(env, env.ledger().timestamp() + timeout_secs) {
        handle_error(env, e);
    }

    // Input validation
    if let Err(e) = validate_init_contract_full(
        env,
        &client,
        &freelancer,
        &arbitrator,
        &token,
        amount,
        timeout_secs,
    ) {
        handle_error(env, e);
    }
    let escrow_data = EscrowData {
        client: client.clone(),
        freelancer,
        arbitrator: Some(arbitrator),
        token: Some(token),
        amount,
        state: EscrowState::Created,
        dispute_result: DisputeResult::None as u32,
        created_at: env.ledger().timestamp(),
        funded_at: None,
        released_at: None,
        disputed_at: None,
        resolved_at: None,
        timeout_secs: Some(timeout_secs),
        milestones: Vec::new(env),
        milestone_history: Vec::new(env),
        released_amount: 0,
        fee_manager: client,
        fee_collected: 0,
        net_amount: amount,
    };
    env.storage().instance().set(&ESCROW_DATA, &escrow_data);
    env.storage().instance().set(&INITIALIZED, &true);
}

pub fn init_contract(
    env: &Env,
    client: Address,
    freelancer: Address,
    amount: i128,
    fee_manager: Address,
) {
    let caller = client.clone();

    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    // Log function call start
    log_function_call(env, "init_contract", &caller, true);

    if env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::AlreadyInitialized);
    }

    // Input validation
    if let Err(e) = validate_init_contract(env, &client, &freelancer, amount, &fee_manager) {
        handle_error(env, e);
    }

    let escrow_data = EscrowData {
        client,
        freelancer :  freelancer.clone(),
        arbitrator: None,
        token: None,
        amount,
        state: EscrowState::Created,
        dispute_result: DisputeResult::None as u32,
        created_at: env.ledger().timestamp(),
        funded_at: None,
        released_at: None,
        disputed_at: None,
        resolved_at: None,
        timeout_secs: None,
        milestones: Vec::new(env),
        milestone_history: Vec::new(env),
        released_amount: 0,
        fee_manager: fee_manager.clone(),
        fee_collected: 0,
        net_amount: amount,
    };

    env.storage().instance().set(&ESCROW_DATA, &escrow_data);
    env.storage().instance().set(&INITIALIZED, &true);
    env.events().publish((Symbol::new(env  , "initiated_contract") ,caller ), (freelancer , amount , fee_manager , env.ledger().timestamp()));
}


pub fn deposit_funds(env: &Env, client: Address) {
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    let caller = client.clone();

    // Log function call start
    log_function_call(env, "deposit_funds", &caller, true);

    client.require_auth();

    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    let mut escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    // Validate timeout hasn't expired
    if let Some(timeout_secs) = escrow_data.timeout_secs {
        if let Err(e) = validate_timestamp(env, escrow_data.created_at + timeout_secs) {
            handle_error(env, e);
        }
    }

    if escrow_data.client != client {
        handle_error(env, Error::Unauthorized);
    }

    if escrow_data.state != EscrowState::Created {
        handle_error(env, Error::InvalidStatus);
    }

    if let (Some(token), amount) = (escrow_data.token.clone(), escrow_data.amount) {
        let balance: i128 = env.invoke_contract::<i128>(
            &token,
            &Symbol::new(env, TOKEN_BALANCE),
            (client.clone(),).into_val(env),
        );
        if balance < amount {
            handle_error(env, Error::InsufficientFunds);
        }

        env.invoke_contract::<()>(
            &token,
            &Symbol::new(env, TOKEN_TRANSFER),
            (client.clone(), env.current_contract_address(), amount).into_val(env),
        );
    }

    escrow_data.state = EscrowState::Funded;
    escrow_data.funded_at = Some(env.ledger().timestamp());

    env.storage().instance().set(&ESCROW_DATA, &escrow_data);
    let total_escrow_transaction = increment_escrow_transaction_count(env);

    env.events().publish(
        (Symbol::new(env, "escrow_tx_count"),),
        total_escrow_transaction,
    );
    env.events().publish(
        (Symbol::new(env, "deposited_fund"), client.clone()),
        (escrow_data.amount, env.ledger().timestamp()),
    );
}

pub fn release_funds(env: &Env, freelancer: Address) {
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    let caller = freelancer.clone();

    // Log function call start
    log_function_call(env, "release_funds", &caller, true);

    freelancer.require_auth();

    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    let mut escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    // Validate timeout hasn't expired
    if let Some(timeout_secs) = escrow_data.timeout_secs {
        if let Err(e) = validate_timestamp(env, escrow_data.created_at + timeout_secs) {
            handle_error(env, e);
        }
    }

    if escrow_data.freelancer != freelancer {
        handle_error(env, Error::Unauthorized);
    }

    if escrow_data.state != EscrowState::Funded {
        handle_error(env, Error::InvalidStatus);
    }

    if let (Some(token), amount) = (escrow_data.token.clone(), escrow_data.amount) {
        env.invoke_contract::<()>(
            &token,
            &Symbol::new(env, TOKEN_TRANSFER),
            (env.current_contract_address(), freelancer.clone(), amount).into_val(env),
        );
    }

    let fee_percentage = 250;
    let fee_amount = (escrow_data.amount * fee_percentage) / 10000;
    let net_amount = escrow_data.amount - fee_amount;

    escrow_data.state = EscrowState::Released;
    escrow_data.released_at = Some(env.ledger().timestamp());
    escrow_data.fee_collected = fee_amount;
    escrow_data.net_amount = net_amount;

    env.storage().instance().set(&ESCROW_DATA, &escrow_data);

    let total_escrow_transaction = increment_escrow_transaction_count(env);

    env.events().publish(
        (Symbol::new(env, "escrow_tx_count"),),
        total_escrow_transaction,
    );
    env.events().publish(
        (Symbol::new(env, "released_fund"), freelancer.clone()),
        (
            escrow_data.amount,
            escrow_data.net_amount,
            escrow_data.fee_collected,
            escrow_data.client,
            env.ledger().timestamp(),
        ),
    );
}

pub fn dispute(env: &Env, caller: Address) {
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    let caller_addr = caller.clone();

    // Log function call start
    log_function_call(env, "dispute", &caller_addr, true);

    caller.require_auth();

    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    let mut escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    if escrow_data.client != caller && escrow_data.freelancer != caller {
        handle_error(env, Error::Unauthorized);
    }

    if escrow_data.state != EscrowState::Funded {
        handle_error(env, Error::InvalidStatus);
    }

    escrow_data.state = EscrowState::Disputed;
    escrow_data.disputed_at = Some(env.ledger().timestamp());

    env.storage().instance().set(&ESCROW_DATA, &escrow_data);

    let total_escrow_transaction = increment_escrow_transaction_count(env);

    env.events().publish(
        (Symbol::new(env, "escrow_tx_count"),),
        total_escrow_transaction,
    );
    env.events().publish(
        (Symbol::new(env, "escrow_disputed"), caller.clone()),
        env.ledger().timestamp(),
    );
}

pub fn resolve_dispute(env: &Env, caller: Address, result: Symbol) {
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    let caller_addr = caller.clone();

    // Log function call start
    log_function_call(env, "resolve_dispute", &caller_addr, true);

    caller.require_auth();

    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    let mut escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    if escrow_data.state != EscrowState::Disputed {
        handle_error(env, Error::DisputeNotOpen);
    }

    if escrow_data.arbitrator != Some(caller.clone()) {
        handle_error(env, Error::Unauthorized);
    }

    // CORREGIDO: Aceptar más variaciones de símbolos
    let dispute_result =
        if result == Symbol::new(env, "client_wins") || result == Symbol::new(env, "client") {
            DisputeResult::ClientWins
        } else if result == Symbol::new(env, "freelancer_wins")
            || result == Symbol::new(env, "freelancer")
        {
            DisputeResult::FreelancerWins
        } else if result == Symbol::new(env, "split") {
            DisputeResult::Split
        } else {
            handle_error(env, Error::InvalidDisputeResult);
        };

    if let (Some(token), amount) = (escrow_data.token.clone(), escrow_data.amount) {
        let contract_addr = env.current_contract_address();
        match dispute_result {
            DisputeResult::ClientWins => {
                env.invoke_contract::<()>(
                    &token,
                    &Symbol::new(env, TOKEN_TRANSFER),
                    (contract_addr.clone(), escrow_data.client.clone(), amount).into_val(env),
                );
            }
            DisputeResult::FreelancerWins => {
                env.invoke_contract::<()>(
                    &token,
                    &Symbol::new(env, TOKEN_TRANSFER),
                    (
                        contract_addr.clone(),
                        escrow_data.freelancer.clone(),
                        amount,
                    )
                        .into_val(env),
                );
            }
            DisputeResult::Split => {
                let half = amount / 2;
                env.invoke_contract::<()>(
                    &token,
                    &Symbol::new(env, TOKEN_TRANSFER),
                    (contract_addr.clone(), escrow_data.client.clone(), half).into_val(env),
                );
                env.invoke_contract::<()>(
                    &token,
                    &Symbol::new(env, TOKEN_TRANSFER),
                    (
                        contract_addr.clone(),
                        escrow_data.freelancer.clone(),
                        amount - half,
                    )
                        .into_val(env),
                );
            }
            DisputeResult::None => {
                handle_error(env, Error::InvalidDisputeResult);
            }
        }
    }

    escrow_data.state = EscrowState::Released; // CORREGIDO: cambiar a Released en lugar de Resolved
    escrow_data.dispute_result = dispute_result as u32;
    escrow_data.resolved_at = Some(env.ledger().timestamp());

    env.storage().instance().set(&ESCROW_DATA, &escrow_data);

    let total_escrow_transaction = increment_escrow_transaction_count(env);

    env.events().publish(
        (Symbol::new(env, "escrow_tx_count"),),
        total_escrow_transaction,
    );
    env.events().publish(
        (Symbol::new(env, "escrow_resolved"), result.clone()),
        env.ledger().timestamp(),
    );
}

pub fn add_milestone(env: &Env, client: Address, desc: String, amount: i128) -> u32 {
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    let caller = client.clone();

    // Log function call start
    log_function_call(env, "add_milestone", &caller, true);

    client.require_auth();

    // Input validation
    if let Err(e) = validate_add_milestone(env, &client, &desc, amount) {
        handle_error(env, e);
    }

    let mut escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    // Rate limit: max 10 milestones per hour per client for this escrow
    let limit_type = String::from_str(env, "add_milestone");
    if let Err(e) = check_rate_limit(env, &client, &limit_type, 10, 3600) {
        handle_error(env, e);
    }

    if escrow.client != client {
        handle_error(env, Error::Unauthorized);
    }

    let m_id = (escrow.milestones.len() as u32) + 1;
    let ts = env.ledger().timestamp();

    let milestone = Milestone {
        id: m_id,
        description: desc.clone(),
        amount,
        approved: false,
        released: false,
        created_at: ts,
        approved_at: None,
        released_at: None,
    };

    escrow.milestones.push_back(milestone.clone());
    escrow.milestone_history.push_back(MilestoneHistory {
        milestone: milestone,
        action: String::from_str(env, "added"),
        timestamp: ts,
    });

    env.storage().instance().set(&ESCROW_DATA, &escrow);

    let total_escrow_transaction = increment_escrow_transaction_count(env);

    env.events().publish(
        (Symbol::new(env, "escrow_tx_count"),),
        total_escrow_transaction,
    );
    env.events().publish(
        (Symbol::new(env, "escrow_milestone_added"), client.clone()),
        (m_id, desc.clone(), amount, env.ledger().timestamp()),
    );
    m_id
}

// Admin helpers for rate limiting: admin is the escrow client
pub fn set_rate_limit_bypass(env: &Env, caller: Address, user: Address, bypass: bool) {
    caller.require_auth();
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    // Only escrow client can toggle bypass
    let escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();
    if escrow.client != caller {
        handle_error(env, Error::Unauthorized);
    }
    set_rate_limit_bypass_flag(env, &user, bypass);

    env.events().publish((Symbol::new(env , "set_rate_limit_bypass") , caller), (user , bypass , env.ledger().timestamp()));
}

pub fn reset_rate_limit(env: &Env, caller: Address, user: Address, limit_type: String) {
    caller.require_auth();
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    let escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();
    if escrow.client != caller {
        handle_error(env, Error::Unauthorized);
    }
    rl_reset(env, &user, &limit_type);
     env.events().publish((Symbol::new(env , "reset_rate_limit") , caller), (user , limit_type, env.ledger().timestamp()));
}

// CORREGIDO: usar índice correcto (milestone_id - 1)
pub fn approve_milestone(env: &Env, client: Address, milestone_id: u32) {
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    let caller = client.clone();

    // Log function call start
    log_function_call(env, "approve_milestone", &caller, true);

    client.require_auth();

    // Input validation
    if let Err(_) = validate_address(&client) {
        handle_error(env, Error::Unauthorized);
    }
    if let Err(e) = validate_milestone_id(milestone_id) {
        handle_error(env, e);
    }

    let mut escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();
    let ts = env.ledger().timestamp();

    if escrow.client != client {
        handle_error(env, Error::Unauthorized);
    }

    // CORREGIDO: convertir milestone_id (base-1) a índice (base-0)
    let index = milestone_id - 1;

    if index >= escrow.milestones.len() {
        handle_error(env, Error::MilestoneNotFound);
    }

    let mut milestone = escrow.milestones.get(index).unwrap();

    if milestone.approved {
        handle_error(env, Error::InvalidStatus);
    }

    milestone.approved = true;
    milestone.approved_at = Some(ts);

    // CORREGIDO: actualizar el milestone en el vector
    escrow.milestones.set(index, milestone.clone());

    escrow.milestone_history.push_back(MilestoneHistory {
        milestone: milestone.clone(),
        action: String::from_str(env, "approved"),
        timestamp: ts,
    });
    env.storage().instance().set(&ESCROW_DATA, &escrow);

    let total_escrow_transaction = increment_escrow_transaction_count(env);

    env.events().publish(
        (Symbol::new(env, "escrow_tx_count"),),
        total_escrow_transaction,
    );
    env.events().publish(
        (
            Symbol::new(env, "escrow_milestone_approved"),
            client.clone(),
        ),
        (milestone_id, env.ledger().timestamp()),
    );
}

// CORREGIDO: usar índice correcto (milestone_id - 1)
pub fn release_milestone(env: &Env, freelancer: Address, milestone_id: u32) {
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    let caller = freelancer.clone();

    // Log function call start
    log_function_call(env, "release_milestone", &caller, true);

    freelancer.require_auth();

    // Input validation
    if let Err(_) = validate_address(&freelancer) {
        handle_error(env, Error::Unauthorized);
    }
    if let Err(e) = validate_milestone_id(milestone_id) {
        handle_error(env, e);
    }

    let mut escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();
    let ts = env.ledger().timestamp();

    if escrow.freelancer != freelancer {
        handle_error(env, Error::Unauthorized);
    }

    // CORREGIDO: convertir milestone_id (base-1) a índice (base-0)
    let index = milestone_id - 1;

    if index >= escrow.milestones.len() {
        handle_error(env, Error::MilestoneNotFound);
    }

    let mut milestone = escrow.milestones.get(index).unwrap();

    if !milestone.approved || milestone.released {
        handle_error(env, Error::InvalidStatus);
    }

    milestone.released = true;
    milestone.released_at = Some(ts);
    escrow.released_amount += milestone.amount;

    // CORREGIDO: actualizar el milestone en el vector
    escrow.milestones.set(index, milestone.clone());

    escrow.milestone_history.push_back(MilestoneHistory {
        milestone: milestone.clone(),
        action: String::from_str(env, "released"),
        timestamp: ts,
    });
    env.storage().instance().set(&ESCROW_DATA, &escrow);

    let total_escrow_transaction = increment_escrow_transaction_count(env);

    env.events().publish(
        (Symbol::new(env, "escrow_tx_count"),),
        total_escrow_transaction,
    );
    env.events().publish(
        (
            Symbol::new(env, "escrow_milestone_released"),
            freelancer.clone(),
        ),
        (milestone_id, milestone.amount, ts),
    );
}

pub fn get_escrow_data(env: &Env) -> EscrowData {
    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    env.storage().instance().get(&ESCROW_DATA).unwrap()
}

pub fn auto_release(env: &Env) {
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }
    let mut escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();
    if escrow_data.state != EscrowState::Funded {
        handle_error(env, Error::InvalidStatus);
    }
    let funded_at = escrow_data.funded_at.unwrap_or(0);
    let timeout = escrow_data.timeout_secs.unwrap_or(0);
    let now = env.ledger().timestamp();
    
    // Validate timestamp
    if let Err(e) = validate_timestamp(env, funded_at + timeout) {
        handle_error(env, e);
    }

    if now < funded_at + timeout {
        handle_error(env, Error::InvalidStatus);
    }

    if let (Some(token), amount) = (escrow_data.token.clone(), escrow_data.amount) {
        env.invoke_contract::<()>(
            &token,
            &Symbol::new(env, TOKEN_TRANSFER),
            (
                env.current_contract_address(),
                escrow_data.freelancer.clone(),
                amount,
            )
                .into_val(env),
        );
    }
    escrow_data.state = EscrowState::Released;
    escrow_data.released_at = Some(now);

    env.storage().instance().set(&ESCROW_DATA, &escrow_data);

    let total_escrow_transaction = increment_escrow_transaction_count(env);

    env.events().publish(
        (Symbol::new(env, "escrow_tx_count"),),
        total_escrow_transaction,
    );
    env.events().publish(
        (
            Symbol::new(env, "auto_released"),
            escrow_data.freelancer.clone(),
        ),
        (escrow_data.amount, now),
    );
}

pub fn get_milestones(env: &Env) -> Vec<Milestone> {
    let escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();
    escrow.milestones.clone()
}

pub fn get_milestone_history(env: &Env) -> Vec<MilestoneHistory> {
    let escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();
    escrow.milestone_history.clone()
}

pub fn set_escrow_data(env: &Env, data: &EscrowData) {
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    env.storage().instance().set(&ESCROW_DATA, data);
}

// Logging functions
pub fn get_call_logs(env: &Env) -> Vec<CallLog> {
    crate::storage::get_call_logs(env)
}

pub fn clear_call_logs(env: &Env, caller: Address) {
    caller.require_auth();

    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    // Only escrow client can clear logs
    let escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();
    if escrow.client != caller {
        handle_error(env, Error::Unauthorized);
    }

    crate::storage::clear_call_logs(env);
}


pub fn set_config(env: &Env, caller: Address, config: ContractConfig) {
    caller.require_auth();

    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }
    
    // Only escrow client can set config (admin functionality)
    let escrow: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();
    if escrow.client != caller { 
        handle_error(env, Error::Unauthorized); 
    }
    
    // Validate config parameters
    if let Err(e) = validate_config(&config) {
        handle_error(env, e);
    }
    
    env.storage().instance().set(&CONTRACT_CONFIG, &config);
    
    env.events().publish(
        (Symbol::new(env, "cfg_upd"), caller),
        (config.min_escrow_amount, config.max_escrow_amount, config.default_timeout_days),
    );
}

pub fn get_config(env: &Env) -> ContractConfig {
    if !env.storage().instance().has(&CONTRACT_CONFIG) {
        handle_error(env, Error::NotInitialized);
    }
    env.storage().instance().get(&CONTRACT_CONFIG).unwrap()
}

// Helper function to validate config parameters
fn validate_config(config: &ContractConfig) -> Result<(), Error> {
    // Validate escrow amounts
    if config.min_escrow_amount >= config.max_escrow_amount {
        return Err(Error::InvalidAmount);
    }
    
    if config.min_escrow_amount < 1 {
        return Err(Error::InvalidAmount);
    }
    
    // Validate timeout (1-365 days)
    if config.default_timeout_days < 1 || config.default_timeout_days > 365 {
        return Err(Error::InvalidAmount);
    }
    
    // Validate max milestones (1-100)
    if config.max_milestones < 1 || config.max_milestones > 100 {
        return Err(Error::InvalidAmount);
    }
    
    // Validate fee percentage (0-10%)
    if config.fee_percentage > 1000 {
        return Err(Error::InvalidAmount);
    }
    
    // Validate rate limit parameters
    if config.rate_limit_window_hours < 1 || config.rate_limit_window_hours > 168 {
        return Err(Error::InvalidAmount);
    }
    
    if config.rate_limit_calls < 1 || config.rate_limit_calls > 1000 {
        return Err(Error::InvalidAmount);
    }
    
    Ok(())
}

pub fn get_total_transactions(env: &Env) -> u64 {
    crate::storage::get_total_transactions(env)
}

pub fn reset_transaction_count(env: &Env, admin: Address) -> Result<(), Error> {
    admin.require_auth();
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }

    let escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    if escrow_data.client != admin {
        handle_error(env, Error::Unauthorized);
    }
    set_escrow_transaction_count(&env, 0u64);

    env.events().publish(
        (
            Symbol::new(env, "transaction_count_reset"),
            escrow_data.client.clone(),
        ),
        env.ledger().timestamp(),
    );
    Ok(())
}

// ==================== DATA EXPORT FUNCTIONS ====================

/// Export escrow data (client, freelancer, or arbitrator can access)
pub fn export_escrow_data(env: &Env, caller: Address, contract_id: String) -> EscrowDataExport {
    if is_paused(env) {
        handle_error(env, Error::ContractPaused);
    }
    
    let caller_addr = caller.clone();

    // Log function call start
    log_function_call(env, "export_escrow_data", &caller_addr, true);

    caller.require_auth();

    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    let escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    // Permission check: client, freelancer, or arbitrator can export data
    let is_authorized = escrow_data.client == caller
        || escrow_data.freelancer == caller
        || escrow_data.arbitrator == Some(caller.clone());

    if !is_authorized {
        handle_error(env, Error::Unauthorized);
    }

    let milestones = get_milestones(env);
    let milestone_history = get_milestone_history(env);

    let export_data = EscrowDataExport {
        contract_id,
        escrow_data: escrow_data.clone(),
        milestones,
        milestone_history,
        export_timestamp: env.ledger().timestamp(),
        export_version: String::from_str(env, "1.0"),
    };

    // Emit export event
    env.events().publish(
        (Symbol::new(env, "escrow_data_exported"), caller),
        env.ledger().timestamp(),
    );

    export_data
}

pub fn get_contract_status(env: &Env, contract_id: Address) -> EscrowSummary {
    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    let escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    // Format Escrow Status
    let escrow_data_status = match escrow_data.state {
        EscrowState::Created => String::from_str(&env, "Initialized"),
        EscrowState::Funded => String::from_str(&env, "Funded"),
        EscrowState::Released => String::from_str(&env, "Released"),
        EscrowState::Disputed => String::from_str(&env, "Disputed"),
        EscrowState::Refunded => String::from_str(&env, "Resolved"),
    };

    let summary = EscrowSummary {
        client: escrow_data.client,
        freelancer: escrow_data.freelancer,
        amount: escrow_data.amount,
        status: escrow_data_status,
        created_at: escrow_data.created_at,
        milestone_count: escrow_data.milestones.len() as u32,
    };

    // Emit event for status retrieval
    env.events().publish(
        (Symbol::new(env, "contract_status_retrieved"),),
        (contract_id, env.ledger().timestamp(), summary.clone())
    );

    summary
}

pub fn validate_timestamp(env: &Env, timestamp: u64) -> Result<(), Error> {
    let current_time = env.ledger().timestamp();
    log!(&env, "current_time: {}", current_time);
    log!(&env, "timestamp: {}", timestamp);

    // Allow timestamps up to MAX_AGE in the future
    if timestamp > current_time + MAX_AGE {
        return Err(Error::InvalidTimestamp); // Too far in the future
    }
    
    // Prevent timestamps older than MAX_AGE
    if timestamp < current_time && current_time - timestamp > MAX_AGE {
        return Err(Error::TimestampTooOld);
    }
    
    Ok(())
}