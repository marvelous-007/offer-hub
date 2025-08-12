use crate::types::{DisputeResult, EscrowStatus};
use crate::{EscrowContract, EscrowContractClient};
use soroban_sdk::testutils::{Address as _, Ledger};
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

#[contract]
pub struct MockTokenContract;

#[contractimpl]
impl MockTokenContract {
    pub fn balance(_env: Env, _addr: Address) -> i128 {
        1000
    }
    pub fn transfer(_env: Env, _from: Address, _to: Address, _amount: i128) {}
}

fn setup_token(env: &Env) -> Address {
    let token_id = Address::generate(env);
    env.register_contract(&token_id, MockTokenContract);
    token_id
}

fn setup_env() -> Env {
    let env = Env::default();
    env.ledger().with_mut(|l| l.timestamp = 1000);
    env
}

#[test]
fn test_deposit_and_release_token() {
    let env = setup_env();
    env.mock_all_auths();

    let contract_id = Address::generate(&env);
    env.register_contract(&contract_id, EscrowContract);
    let contract = EscrowContractClient::new(&env, &contract_id);

    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let arbitrator = Address::generate(&env);
    let token = setup_token(&env);
    let amount = 500;
    let timeout = 100;

    contract.init_contract_full(&client, &freelancer, &arbitrator, &token, &amount, &timeout);
    contract.deposit_funds(&client);
    let data = env.as_contract(&contract_id, || crate::contract::get_escrow_data(&env));
    assert_eq!(data.status, EscrowStatus::Funded);

    contract.release_funds(&freelancer);
    let data = env.as_contract(&contract_id, || crate::contract::get_escrow_data(&env));
    assert_eq!(data.status, EscrowStatus::Released);
}