#![cfg(test)]
use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    Address, Env, Symbol, Vec as SorobanVec, String as SorobanString,
};

fn create_env() -> Env {
    Env::default()
}

fn register_contract(env: &Env) -> Address {
    env.register(Contract, ())
}

fn setup_ledger_time(env: &Env, timestamp: u64) {
    env.ledger().set(LedgerInfo {
        timestamp,
        protocol_version: 22,
        sequence_number: env.ledger().sequence(),
        network_id: Default::default(),
        base_reserve: 10,
        min_temp_entry_ttl: 1_000_000,
        min_persistent_entry_ttl: 1_000_000,
        max_entry_ttl: 6_312_000,
    });
}

fn create_client<'a>(env: &'a Env, contract_id: &Address) -> ContractClient<'a> {
    ContractClient::new(env, contract_id)
}

fn create_skills_vec(env: &Env, skills: &[&str]) -> SorobanVec<Symbol> {
    let mut skills_vec = SorobanVec::new(env);
    for skill in skills {
        skills_vec.push_back(Symbol::new(env, skill));
    }
    skills_vec
}

// ==================== FREELANCER REGISTRATION TESTS ====================

#[test]
fn test_register_freelancer_success() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    let freelancer = Address::generate(&env);
    let skills = create_skills_vec(&env, &["rust", "blockchain", "smart_contracts"]);
    let hourly_rate = 100;
    let timestamp = 1746000000u64;
    setup_ledger_time(&env, timestamp);

    // Register freelancer
    client.register_freelancer(&freelancer, &skills, &hourly_rate);

    // Verify freelancer is registered
    assert!(client.is_registered(&freelancer));

    // Verify freelancer profile data
    let profile = client.get_freelancer(&freelancer);
    assert_eq!(profile.address, freelancer);
    assert_eq!(profile.skills, skills);
    assert_eq!(profile.hourly_rate, hourly_rate);
    assert_eq!(profile.total_earnings, 0);
    assert_eq!(profile.jobs_completed, 0);
    assert_eq!(profile.registered_at, timestamp);
    assert_eq!(profile.last_updated, timestamp);
}

#[test]
#[should_panic(expected = "Freelancer already registered")]
fn test_register_duplicate_freelancer_fails() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    let freelancer = Address::generate(&env);
    let skills = create_skills_vec(&env, &["rust"]);
    let hourly_rate = 100;

    // Register freelancer first time
    client.register_freelancer(&freelancer, &skills, &hourly_rate);
    
    // Attempt to register same freelancer again - should panic
    client.register_freelancer(&freelancer, &skills, &hourly_rate);
}

// ==================== SKILLS MANAGEMENT TESTS ====================

#[test]
fn test_update_skills_success() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    let freelancer = Address::generate(&env);
    let initial_skills = create_skills_vec(&env, &["rust", "blockchain"]);
    let hourly_rate = 100;

    // Register freelancer
    client.register_freelancer(&freelancer, &initial_skills, &hourly_rate);
    
    // Update skills
    let new_skills = create_skills_vec(&env, &["rust", "blockchain", "stellar"]);
    client.update_skills(&freelancer, &new_skills);

    // Verify skills were updated
    let profile = client.get_freelancer(&freelancer);
    assert_eq!(profile.skills, new_skills);
}

#[test]
fn test_add_skill_success() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    let freelancer = Address::generate(&env);
    let initial_skills = create_skills_vec(&env, &["rust"]);
    let hourly_rate = 100;

    // Register freelancer
    client.register_freelancer(&freelancer, &initial_skills, &hourly_rate);
    
    // Add a new skill
    let new_skill = Symbol::new(&env, "blockchain");
    client.add_skill(&freelancer, &new_skill);

    // Verify skill was added
    let profile = client.get_freelancer(&freelancer);
    assert_eq!(profile.skills.len(), 2);
    assert!(profile.skills.contains(&new_skill));
}

#[test]
fn test_remove_skill_success() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    let freelancer = Address::generate(&env);
    let skill_to_remove = Symbol::new(&env, "rust");
    let initial_skills = create_skills_vec(&env, &["rust", "blockchain"]);
    let hourly_rate = 100;

    // Register freelancer
    client.register_freelancer(&freelancer, &initial_skills, &hourly_rate);
    
    // Remove a skill
    client.remove_skill(&freelancer, &skill_to_remove);

    // Verify skill was removed
    let profile = client.get_freelancer(&freelancer);
    assert_eq!(profile.skills.len(), 1);
    assert!(!profile.skills.contains(&skill_to_remove));
}

// ==================== HOURLY RATE TESTS ====================

#[test]
fn test_update_hourly_rate_success() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    let freelancer = Address::generate(&env);
    let skills = create_skills_vec(&env, &["rust"]);
    let initial_rate = 100;
    let new_rate = 150;

    // Register freelancer
    client.register_freelancer(&freelancer, &skills, &initial_rate);
    
    // Update hourly rate
    client.update_hourly_rate(&freelancer, &new_rate);

    // Verify rate was updated
    let profile = client.get_freelancer(&freelancer);
    assert_eq!(profile.hourly_rate, new_rate);
}

// ==================== JOB MANAGEMENT TESTS ====================

#[test]
fn test_add_job_success() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    let freelancer = Address::generate(&env);
    let client_address = Address::generate(&env);
    let skills = create_skills_vec(&env, &["rust"]);
    let hourly_rate = 100;
    let payment = 500;
    let job_description = SorobanString::from_str(&env, "Develop smart contract");

    // Register freelancer
    client.register_freelancer(&freelancer, &skills, &hourly_rate);
    
    // Add a job
    client.add_job(&freelancer, &client_address, &job_description, &payment);

    // Verify job was added and earnings updated
    let profile = client.get_freelancer(&freelancer);
    assert_eq!(profile.total_earnings, payment);
    assert_eq!(profile.jobs_completed, 1);
    
    // Verify job details
    let jobs = client.get_all_jobs(&freelancer);
    assert_eq!(jobs.len(), 1);
    assert_eq!(jobs.get(0).unwrap().freelancer, freelancer);
    assert_eq!(jobs.get(0).unwrap().client, client_address);
    assert_eq!(jobs.get(0).unwrap().description, job_description);
    assert_eq!(jobs.get(0).unwrap().payment, payment);
}

// ==================== RATING TESTS ====================

#[test]
fn test_rate_freelancer_success() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    let freelancer = Address::generate(&env);
    let client_address = Address::generate(&env);
    let skills = create_skills_vec(&env, &["rust"]);
    let hourly_rate = 100;
    let rating = 5;
    let comment = SorobanString::from_str(&env, "Excellent work!");

    // Register freelancer
    client.register_freelancer(&freelancer, &skills, &hourly_rate);
    
    // Rate the freelancer
    client.rate_freelancer(&freelancer, &client_address, &rating, &comment);

    // Verify rating was added
    let ratings = client.get_all_ratings(&freelancer);
    assert_eq!(ratings.len(), 1);
    assert_eq!(ratings.get(0).unwrap().freelancer, freelancer);
    assert_eq!(ratings.get(0).unwrap().client, client_address);
    assert_eq!(ratings.get(0).unwrap().rating, rating);
    assert_eq!(ratings.get(0).unwrap().comment, comment);
    
    // Verify average rating
    let avg_rating = client.get_average_rating(&freelancer);
    assert_eq!(avg_rating, rating);
}

#[test]
#[should_panic(expected = "Rating must be between 1 and 5")]
fn test_invalid_rating_fails() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    let freelancer = Address::generate(&env);
    let client_address = Address::generate(&env);
    let skills = create_skills_vec(&env, &["rust"]);
    let hourly_rate = 100;
    let invalid_rating = 6;  // Invalid rating (> 5)
    let comment = SorobanString::from_str(&env, "Invalid rating");

    // Register freelancer
    client.register_freelancer(&freelancer, &skills, &hourly_rate);
    
    // Try to add invalid rating - should panic
    client.rate_freelancer(&freelancer, &client_address, &invalid_rating, &comment);
}

// ==================== SEARCH TESTS ====================

#[test]
fn test_search_by_skill() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    // Create freelancers with different skills
    let freelancer1 = Address::generate(&env);
    let freelancer2 = Address::generate(&env);
    let freelancer3 = Address::generate(&env);
    
    let skills1 = create_skills_vec(&env, &["rust", "blockchain"]);
    let skills2 = create_skills_vec(&env, &["javascript", "blockchain"]);
    let skills3 = create_skills_vec(&env, &["python", "data_science"]);
    
    // Register freelancers
    client.register_freelancer(&freelancer1, &skills1, &100);
    client.register_freelancer(&freelancer2, &skills2, &120);
    client.register_freelancer(&freelancer3, &skills3, &90);
    
    // Search for blockchain skill
    let blockchain_skill = Symbol::new(&env, "blockchain");
    let results = client.search_by_skill(&blockchain_skill);
    
    // Verify search results
    assert_eq!(results.len(), 2);
    // Create a SorobanVec to store the addresses
    let mut result_addresses = SorobanVec::new(&env);
    for freelancer in results.iter() {
        result_addresses.push_back(freelancer.address.clone());
    }
    assert!(result_addresses.contains(&freelancer1));
    assert!(result_addresses.contains(&freelancer2));
    assert!(!result_addresses.contains(&freelancer3));
}

// ==================== FREELANCER MANAGEMENT TESTS ====================

#[test]
fn test_remove_freelancer() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    let freelancer = Address::generate(&env);
    let skills = create_skills_vec(&env, &["rust"]);
    let hourly_rate = 100;

    // Register freelancer
    client.register_freelancer(&freelancer, &skills, &hourly_rate);
    assert!(client.is_registered(&freelancer));
    
    // Remove freelancer
    client.remove_freelancer(&freelancer);
    
    // Verify freelancer was removed
    assert!(!client.is_registered(&freelancer));
}

#[test]
fn test_get_freelancer_count() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    // Initial count should be 0
    assert_eq!(client.get_freelancer_count(), 0);
    
    // Register freelancers
    let freelancer1 = Address::generate(&env);
    let freelancer2 = Address::generate(&env);
    let skills = create_skills_vec(&env, &["rust"]);
    
    client.register_freelancer(&freelancer1, &skills, &100);
    assert_eq!(client.get_freelancer_count(), 1);
    
    client.register_freelancer(&freelancer2, &skills, &120);
    assert_eq!(client.get_freelancer_count(), 2);
    
    // Remove a freelancer
    client.remove_freelancer(&freelancer1);
    assert_eq!(client.get_freelancer_count(), 1);
}

#[test]
fn test_get_all_freelancers() {
    let env = create_env();
    env.mock_all_auths();
    let contract_id = register_contract(&env);
    let client = create_client(&env, &contract_id);
    
    // Register freelancers
    let freelancer1 = Address::generate(&env);
    let freelancer2 = Address::generate(&env);
    let skills = create_skills_vec(&env, &["rust"]);
    
    client.register_freelancer(&freelancer1, &skills, &100);
    client.register_freelancer(&freelancer2, &skills, &120);
    
    // Get all freelancers
    let all_freelancers = client.get_all_freelancers();
    
    // Verify results
    assert_eq!(all_freelancers.len(), 2);
    assert!(all_freelancers.contains(&freelancer1));
    assert!(all_freelancers.contains(&freelancer2));
}
