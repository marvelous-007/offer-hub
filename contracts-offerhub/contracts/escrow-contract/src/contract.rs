use soroban_sdk::{Address, Env, Symbol};

use crate::{
    error::{handle_error},
    storage::{ESCROW_DATA, INITIALIZED},
    types::{DisputeResult, EscrowData, EscrowStatus, Error},
};

pub fn init_contract(env: &Env, client: Address, freelancer: Address, amount: i128) {
    // Check if contract is already initialized
    if env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::AlreadyInitialized);
    }

    // Validate amount
    if amount <= 0 {
        handle_error(env, Error::InvalidAmount);
    }

    // Create escrow data
    let escrow_data = EscrowData {
        client,
        freelancer,
        amount,
        status: EscrowStatus::Initialized,
        dispute_result: None,
        created_at: env.ledger().timestamp(),
        funded_at: None,
        released_at: None,
        disputed_at: None,
        resolved_at: None,
    };

    // Store escrow data
    env.storage().instance().set(&ESCROW_DATA, &escrow_data);
    env.storage().instance().set(&INITIALIZED, &true);
}

pub fn deposit_funds(env: &Env, client: Address) {
    // Require client authorization
    client.require_auth();

    // Check if contract is initialized
    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    let mut escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    // Verify the caller is the client
    if escrow_data.client != client {
        handle_error(env, Error::Unauthorized);
    }

    // Check if escrow is in correct status
    if escrow_data.status != EscrowStatus::Initialized {
        handle_error(env, Error::InvalidStatus);
    }

    // Update escrow status and timestamp
    escrow_data.status = EscrowStatus::Funded;
    escrow_data.funded_at = Some(env.ledger().timestamp());

    // Store updated escrow data
    env.storage().instance().set(&ESCROW_DATA, &escrow_data);
}

pub fn release_funds(env: &Env, freelancer: Address) {
    // Require freelancer authorization
    freelancer.require_auth();

    // Check if contract is initialized
    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    let mut escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    // Verify the caller is the freelancer
    if escrow_data.freelancer != freelancer {
        handle_error(env, Error::Unauthorized);
    }

    // Check if escrow is in correct status
    if escrow_data.status != EscrowStatus::Funded {
        handle_error(env, Error::InvalidStatus);
    }

    // Update escrow status and timestamp
    escrow_data.status = EscrowStatus::Released;
    escrow_data.released_at = Some(env.ledger().timestamp());

    // Store updated escrow data
    env.storage().instance().set(&ESCROW_DATA, &escrow_data);
}

pub fn dispute(env: &Env, caller: Address) {
    // Require caller authorization
    caller.require_auth();

    // Check if contract is initialized
    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    let mut escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    // Verify the caller is either client or freelancer
    if escrow_data.client != caller && escrow_data.freelancer != caller {
        handle_error(env, Error::Unauthorized);
    }

    // Check if escrow is in correct status (can only dispute when funded)
    if escrow_data.status != EscrowStatus::Funded {
        handle_error(env, Error::InvalidStatus);
    }

    // Update escrow status and timestamp
    escrow_data.status = EscrowStatus::Disputed;
    escrow_data.disputed_at = Some(env.ledger().timestamp());

    // Store updated escrow data
    env.storage().instance().set(&ESCROW_DATA, &escrow_data);
}

pub fn resolve_dispute(env: &Env, result: Symbol) {
    // Check if contract is initialized
    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    let mut escrow_data: EscrowData = env.storage().instance().get(&ESCROW_DATA).unwrap();

    // Check if escrow is in disputed status
    if escrow_data.status != EscrowStatus::Disputed {
        handle_error(env, Error::DisputeNotOpen);
    }

    // Parse dispute result
    let dispute_result = if result == Symbol::new(env, "client_wins") {
        DisputeResult::ClientWins
    } else if result == Symbol::new(env, "freelancer_wins") {
        DisputeResult::FreelancerWins
    } else if result == Symbol::new(env, "split") {
        DisputeResult::Split
    } else {
        handle_error(env, Error::InvalidDisputeResult);
    };

    // Update escrow status and dispute result
    escrow_data.status = EscrowStatus::Resolved;
    escrow_data.dispute_result = Some(dispute_result);
    escrow_data.resolved_at = Some(env.ledger().timestamp());

    // Store updated escrow data
    env.storage().instance().set(&ESCROW_DATA, &escrow_data);
}

pub fn get_escrow_data(env: &Env) -> EscrowData {
    // Check if contract is initialized
    if !env.storage().instance().has(&INITIALIZED) {
        handle_error(env, Error::NotInitialized);
    }

    env.storage().instance().get(&ESCROW_DATA).unwrap()
}
