#![cfg(test)]

use crate::{Contract, storage::{get_verified_users, set_verified_users}};
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_unregistered_user_is_not_verified() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let user = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let is_verified = Contract::is_verified(env.clone(), user);
        assert!(!is_verified);
    });
}

#[test]
fn test_manual_register_and_query() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let user = Address::generate(&env);

    env.as_contract(&contract_id, || {
        // Simulate the manual registration in storage
        let mut users = get_verified_users(&env);
        users.set(user.clone(), true);
        set_verified_users(&env, &users);

        let is_verified = Contract::is_verified(env.clone(), user.clone());
        assert!(is_verified);
    });
}

#[test]
fn test_duplicate_manual_register() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let user = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let mut users = get_verified_users(&env);
        users.set(user.clone(), true);
        set_verified_users(&env, &users);

        // Trying to register again manually does not change the value
        let mut users2 = get_verified_users(&env);
        users2.set(user.clone(), true);
        set_verified_users(&env, &users2);

        let is_verified = Contract::is_verified(env.clone(), user.clone());
        assert!(is_verified);
    });
}

#[test]
fn test_multiple_users_verification() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let user3 = Address::generate(&env);

    env.as_contract(&contract_id, || {
        let mut users = get_verified_users(&env);
        users.set(user1.clone(), true);
        users.set(user2.clone(), true);
        set_verified_users(&env, &users);

        assert!(Contract::is_verified(env.clone(), user1.clone()));
        assert!(Contract::is_verified(env.clone(), user2.clone()));
        assert!(!Contract::is_verified(env.clone(), user3.clone()));
    });
} 