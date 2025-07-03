use crate::storage::{FreelancerStorage, Job, JobStorage};
use soroban_sdk::{Address, Env, String};

/// Add a new job to freelancer's history.
pub fn add_job(env: Env, freelancer: Address, client: Address, job_description: String, payment: u64) {
    client.require_auth();

    // Verify freelancer exists
    if !FreelancerStorage::has(&env, &freelancer) {
        panic!("Freelancer not registered");
    }

    let timestamp = env.ledger().timestamp();
    
    // Create job record
    let job = Job {
        freelancer: freelancer.clone(),
        client: client.clone(),
        description: job_description,
        payment,
        timestamp,
    };

    // Add job to storage
    JobStorage::add_job(&env, &job);
    
    // Update freelancer's earnings and job count
    FreelancerStorage::update_total_earnings(&env, &freelancer, payment);
}

/// Get all jobs for a freelancer.
pub fn get_all_jobs(env: Env, freelancer: Address) -> soroban_sdk::Vec<Job> {
    // Verify freelancer exists
    if !FreelancerStorage::has(&env, &freelancer) {
        panic!("Freelancer not registered");
    }

    JobStorage::get_jobs_for_freelancer(&env, &freelancer)
}
