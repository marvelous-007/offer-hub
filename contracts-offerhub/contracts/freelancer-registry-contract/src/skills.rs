use crate::storage::{Freelancer, FreelancerStorage};
use soroban_sdk::{Address, Env, Symbol, Vec};

/// Update freelancer's skills.
pub fn update_skills(env: Env, freelancer: Address, new_skills: Vec<Symbol>) {
    freelancer.require_auth();

    let mut freelancer_data = FreelancerStorage::get(&env, &freelancer).expect("Freelancer not registered");
    freelancer_data.skills = new_skills.clone();
    freelancer_data.last_updated = env.ledger().timestamp();
    FreelancerStorage::set(&env, &freelancer, &freelancer_data);
}

/// Add a skill to freelancer's profile.
pub fn add_skill(env: Env, freelancer: Address, skill: Symbol) {
    freelancer.require_auth();

    let mut freelancer_data = FreelancerStorage::get(&env, &freelancer).expect("Freelancer not registered");
    
    // Check if skill already exists
    if !freelancer_data.skills.contains(&skill) {
        freelancer_data.skills.push_back(skill.clone());
        freelancer_data.last_updated = env.ledger().timestamp();
        FreelancerStorage::set(&env, &freelancer, &freelancer_data);
    }
}

/// Remove a skill from freelancer's profile.
pub fn remove_skill(env: Env, freelancer: Address, skill: Symbol) {
    freelancer.require_auth();

    let mut freelancer_data = FreelancerStorage::get(&env, &freelancer).expect("Freelancer not registered");
    
    if let Some(index) = freelancer_data
        .skills
        .iter()
        .position(|s| s == skill)
    {
        freelancer_data.skills.remove(index.try_into().unwrap());
        freelancer_data.last_updated = env.ledger().timestamp();
        FreelancerStorage::set(&env, &freelancer, &freelancer_data);
    }
}

/// Get all freelancer's skills.
pub fn get_skills(env: Env, freelancer: Address) -> Vec<Symbol> {
    let freelancer_data = FreelancerStorage::get(&env, &freelancer).expect("Freelancer not registered");
    freelancer_data.skills
}

/// Check if freelancer has a specific skill.
pub fn has_skill(env: Env, freelancer: Address, skill: Symbol) -> bool {
    let freelancer_data = FreelancerStorage::get(&env, &freelancer).expect("Freelancer not registered");
    freelancer_data.skills.contains(&skill)
}

/// Search for freelancers with a specific skill.
pub fn search_by_skill(env: Env, skill: Symbol) -> Vec<Freelancer> {
    let all_freelancers = FreelancerStorage::get_all_freelancers(&env);
    let mut matching_freelancers = Vec::new(&env);
    
    for freelancer_addr in all_freelancers.iter() {
        if has_skill(env.clone(), freelancer_addr.clone(), skill.clone()) {
            let freelancer = FreelancerStorage::get_full_profile(&env, &freelancer_addr);
            matching_freelancers.push_back(freelancer);
        }
    }
    
    matching_freelancers
}
