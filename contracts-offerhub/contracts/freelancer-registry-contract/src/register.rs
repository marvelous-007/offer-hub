use crate::storage::{Freelancer, FreelancerStorage};
use soroban_sdk::{Address, Env, Symbol, Vec};

/// Registers a new freelancer with skills and hourly rate.
pub fn register_freelancer(env: Env, freelancer: Address, skills: Vec<Symbol>, hourly_rate: u64) {
    freelancer.require_auth();

    if is_registered(env.clone(), freelancer.clone()) {
        panic!("Freelancer already registered");
    }

    let timestamp = env.ledger().timestamp();
    let new_freelancer = Freelancer {
        address: freelancer.clone(),
        skills: skills.clone(),
        hourly_rate,
        total_earnings: 0,
        jobs_completed: 0,
        registered_at: timestamp,
        last_updated: timestamp,
    };

    FreelancerStorage::set(&env, &freelancer, &new_freelancer);
}

/// Update freelancer's hourly rate.
pub fn update_hourly_rate(env: Env, freelancer: Address, new_rate: u64) {
    freelancer.require_auth();

    if !is_registered(env.clone(), freelancer.clone()) {
        panic!("Freelancer not registered");
    }

    FreelancerStorage::update_hourly_rate(&env, &freelancer, new_rate);
}

/// Check if a freelancer is registered.
pub fn is_registered(env: Env, freelancer: Address) -> bool {
    FreelancerStorage::has(&env, &freelancer)
}

/// Get freelancer full profile or panic.
pub fn get_freelancer_profile(env: Env, freelancer: Address) -> Freelancer {
    FreelancerStorage::get(&env, &freelancer).expect("Freelancer not registered")
}

/// Get freelancer's registration timestamp.
pub fn get_registration_time(env: Env, freelancer: Address) -> u64 {
    let freelancer_data = FreelancerStorage::get(&env, &freelancer).expect("Freelancer not registered");
    freelancer_data.registered_at
}

/// Remove a freelancer from the registry.
pub fn remove_freelancer(env: Env, freelancer: Address) {
    freelancer.require_auth();

    if !is_registered(env.clone(), freelancer.clone()) {
        panic!("Freelancer not registered");
    }

    FreelancerStorage::remove(&env, &freelancer);
}
