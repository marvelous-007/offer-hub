#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_init() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register(Contract, ());

    // Test successful initialization within contract context
    env.as_contract(&contract_id, || {
        // Initialize contract
        let result = Contract::init(env.clone(), admin.clone());
        assert!(result.is_ok());

        let stored_admin = Contract::get_admin(env.clone());
        assert!(stored_admin.is_ok());
        assert_eq!(stored_admin.unwrap(), admin);
    });
}

#[test]
fn test_claim_reward_success() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let contract_id = env.register(Contract, ());

    env.as_contract(&contract_id, || {
        // Initialize contract
        Contract::init(env.clone(), admin).unwrap();

        // Test successful reward claim
        let event_key = String::from_str(&env, "job_completed");
        let result = Contract::claim_reward(env.clone(), user.clone(), event_key.clone());
        assert!(result.is_ok());

        // Verify reward was stored
        let rewards = Contract::get_rewards(env.clone(), user.clone());
        assert_eq!(rewards.len(), 1);
        assert_eq!(rewards.get(0).unwrap().event_key, event_key);

        // Verify claim status
        let claimed = Contract::has_claimed(env.clone(), user, event_key);
        assert!(claimed);
    });
}

#[test]
fn test_claim_reward_duplicate() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let contract_id = env.register(Contract, ());

    env.as_contract(&contract_id, || {
        // Initialize contract first
        Contract::init(env.clone(), admin).unwrap();
    });

    // Test duplicate claim in separate context
    env.as_contract(&contract_id, || {
        let event_key = String::from_str(&env, "5_star_rating");

        // First claim should succeed
        let result1 = Contract::claim_reward(env.clone(), user.clone(), event_key.clone());
        assert!(result1.is_ok());
    });

    env.as_contract(&contract_id, || {
        let event_key = String::from_str(&env, "5_star_rating");

        // Verify first claim worked
        assert!(Contract::has_claimed(
            env.clone(),
            user.clone(),
            event_key.clone()
        ));

        // Second claim should fail
        let result2 = Contract::claim_reward(env.clone(), user, event_key);
        assert!(result2.is_err());
    });
}

#[test]
fn test_claim_reward_invalid_event() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let contract_id = env.register(Contract, ());

    env.as_contract(&contract_id, || {
        // Initialize contract
        Contract::init(env.clone(), admin).unwrap();

        // Test with empty event key
        let empty_event = String::from_str(&env, "");
        let result = Contract::claim_reward(env.clone(), user, empty_event);
        assert!(result.is_err());
    });
}

#[test]
fn test_get_rewards_multiple() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let contract_id = env.register(Contract, ());

    env.as_contract(&contract_id, || {
        // Initialize contract
        Contract::init(env.clone(), admin).unwrap();
    });

    // Claim first reward
    env.as_contract(&contract_id, || {
        let event1 = String::from_str(&env, "job_completed");
        Contract::claim_reward(env.clone(), user.clone(), event1).unwrap();
    });

    // Claim second reward
    env.as_contract(&contract_id, || {
        let event2 = String::from_str(&env, "5_star_rating");
        Contract::claim_reward(env.clone(), user.clone(), event2).unwrap();
    });

    // Claim third reward
    env.as_contract(&contract_id, || {
        let event3 = String::from_str(&env, "consistent_participation");
        Contract::claim_reward(env.clone(), user.clone(), event3).unwrap();
    });

    // Verify all rewards are stored
    env.as_contract(&contract_id, || {
        let rewards = Contract::get_rewards(env.clone(), user.clone());
        assert_eq!(rewards.len(), 3);

        let event1 = String::from_str(&env, "job_completed");
        let event2 = String::from_str(&env, "5_star_rating");
        let event3 = String::from_str(&env, "consistent_participation");

        // Verify each event was claimed
        assert!(Contract::has_claimed(env.clone(), user.clone(), event1));
        assert!(Contract::has_claimed(env.clone(), user.clone(), event2));
        assert!(Contract::has_claimed(env.clone(), user.clone(), event3));
    });
}

#[test]
fn test_get_rewards_empty() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let contract_id = env.register(Contract, ());

    env.as_contract(&contract_id, || {
        // Initialize contract
        Contract::init(env.clone(), admin).unwrap();

        // User with no rewards should return empty vector
        let rewards = Contract::get_rewards(env.clone(), user);
        assert_eq!(rewards.len(), 0);
    });
}

#[test]
fn test_has_claimed_false() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let contract_id = env.register(Contract, ());

    env.as_contract(&contract_id, || {
        // Initialize contract
        Contract::init(env.clone(), admin).unwrap();

        let event_key = String::from_str(&env, "job_completed");

        // Should return false for unclaimed event
        let claimed = Contract::has_claimed(env.clone(), user, event_key);
        assert!(!claimed);
    });
}

#[test]
fn test_multiple_users() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let contract_id = env.register(Contract, ());

    env.as_contract(&contract_id, || {
        // Initialize contract
        Contract::init(env.clone(), admin).unwrap();

        let event_key = String::from_str(&env, "job_completed");

        // Both users claim the same event
        Contract::claim_reward(env.clone(), user1.clone(), event_key.clone()).unwrap();
        Contract::claim_reward(env.clone(), user2.clone(), event_key.clone()).unwrap();

        // Both should have their own rewards
        let claimed1 = Contract::has_claimed(env.clone(), user1.clone(), event_key.clone());
        let claimed2 = Contract::has_claimed(env.clone(), user2.clone(), event_key);
        assert!(claimed1);
        assert!(claimed2);

        let rewards1 = Contract::get_rewards(env.clone(), user1);
        let rewards2 = Contract::get_rewards(env.clone(), user2);

        assert_eq!(rewards1.len(), 1);
        assert_eq!(rewards2.len(), 1);
    });
}
