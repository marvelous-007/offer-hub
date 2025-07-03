use soroban_sdk::{contracttype, Address, Bytes, BytesN, Env, Map, String, Symbol, Vec};

/// Struct that represents a registered freelancer
#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Freelancer {
    pub address: Address,
    pub skills: Vec<Symbol>,
    pub hourly_rate: u64,
    pub total_earnings: u64,
    pub jobs_completed: u64,
    pub registered_at: u64,
    pub last_updated: u64,
}

/// Struct that represents a job completed by a freelancer
#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Job {
    pub freelancer: Address,
    pub client: Address,
    pub description: String,
    pub payment: u64,
    pub timestamp: u64,
}

/// Struct that represents a rating given to a freelancer
#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Rating {
    pub freelancer: Address,
    pub client: Address,
    pub rating: u32,  // Rating from 1-5
    pub comment: String,
    pub timestamp: u64,
}

/// FREELANCER_STORAGE is a Map<Address, Freelancer>
pub struct FreelancerStorage;

impl FreelancerStorage {
    const _STORAGE_KEY: &'static str = "freelancer_storage";

    pub fn get(env: &Env, freelancer: &Address) -> Option<Freelancer> {
        let storage: Map<Address, Freelancer> = env
            .storage()
            .persistent()
            .get(&Self::key(env))
            .unwrap_or(Map::new(env));
        storage.get(freelancer.clone())
    }

    pub fn set(env: &Env, freelancer: &Address, freelancer_data: &Freelancer) {
        let mut storage: Map<Address, Freelancer> = env
            .storage()
            .persistent()
            .get(&Self::key(env))
            .unwrap_or(Map::new(env));

        storage.set(freelancer.clone(), freelancer_data.clone());
        env.storage().persistent().set(&Self::key(env), &storage);
    }

    pub fn has(env: &Env, freelancer: &Address) -> bool {
        Self::get(env, freelancer).is_some()
    }

    // Remove a freelancer from storage
    pub fn remove(env: &Env, freelancer: &Address) {
        let mut storage: Map<Address, Freelancer> = env
            .storage()
            .persistent()
            .get(&Self::key(env))
            .unwrap_or(Map::new(env));

        storage.remove(freelancer.clone());
        env.storage().persistent().set(&Self::key(env), &storage);
    }

    // Get all freelancers' addresses
    pub fn get_all_freelancers(env: &Env) -> Vec<Address> {
        let storage: Map<Address, Freelancer> = env
            .storage()
            .persistent()
            .get(&Self::key(env))
            .unwrap_or(Map::new(env));
        let keys = storage.keys();
        let mut result = soroban_sdk::Vec::new(env);
        for key in keys {
            result.push_back(key);
        }
        result
    }

    // Get freelancers registered in the last N seconds
    pub fn get_recent_freelancers(env: &Env, cutoff_time: u64) -> Vec<Freelancer> {
        let storage: Map<Address, Freelancer> = env
            .storage()
            .persistent()
            .get(&Self::key(env))
            .unwrap_or(Map::new(env));

        let mut recent_freelancers = Vec::new(&env);
        for (_, freelancer) in storage.iter() {
            if freelancer.registered_at > cutoff_time {
                recent_freelancers.push_back(freelancer.clone());
            }
        }
        recent_freelancers
    }

    // Get the total number of registered freelancers
    pub fn get_freelancer_count(env: &Env) -> u64 {
        let storage: Map<Address, Freelancer> = env
            .storage()
            .persistent()
            .get(&Self::key(env))
            .unwrap_or(Map::new(env));

        storage.len() as u64
    }

    // Update freelancer's hourly rate
    pub fn update_hourly_rate(env: &Env, freelancer: &Address, new_rate: u64) {
        let mut freelancer_data = Self::get(env, freelancer).expect("Freelancer not registered");
        freelancer_data.hourly_rate = new_rate;
        freelancer_data.last_updated = env.ledger().timestamp();
        Self::set(env, freelancer, &freelancer_data);
    }

    // Update freelancer's total earnings
    pub fn update_total_earnings(env: &Env, freelancer: &Address, payment: u64) {
        let mut freelancer_data = Self::get(env, freelancer).expect("Freelancer not registered");
        freelancer_data.total_earnings += payment;
        freelancer_data.jobs_completed += 1;
        freelancer_data.last_updated = env.ledger().timestamp();
        Self::set(env, freelancer, &freelancer_data);
    }

    // Get the full freelancer profile
    pub fn get_full_profile(env: &Env, freelancer: &Address) -> Freelancer {
        Self::get(env, freelancer).expect("Freelancer not registered")
    }

    // Helper function to generate the key for storage access
    fn key(env: &Env) -> BytesN<32> {
        let mut key_bytes = Bytes::new(&env);
        key_bytes.append(&Bytes::from_slice(&env, "freelancer_storage".as_bytes()));
        let hash = env.crypto().sha256(&key_bytes);
        BytesN::from_array(&env, &hash.to_array())
    }
}

/// JOB_STORAGE is a Map<(Address, u64), Job>
pub struct JobStorage;

impl JobStorage {
    const _STORAGE_KEY: &'static str = "job_storage";

    pub fn add_job(env: &Env, job: &Job) {
        let mut storage: Map<(Address, u64), Job> = env
            .storage()
            .persistent()
            .get(&Self::key(env))
            .unwrap_or(Map::new(env));

        let key = (job.freelancer.clone(), job.timestamp);
        storage.set(key, job.clone());
        env.storage().persistent().set(&Self::key(env), &storage);
    }

    pub fn get_jobs_for_freelancer(env: &Env, freelancer: &Address) -> Vec<Job> {
        let storage: Map<(Address, u64), Job> = env
            .storage()
            .persistent()
            .get(&Self::key(env))
            .unwrap_or(Map::new(env));

        let mut jobs = Vec::new(&env);
        for ((job_freelancer, _), job) in storage.iter() {
            if job_freelancer == *freelancer {
                jobs.push_back(job);
            }
        }
        jobs
    }

    // Helper function to generate the key for storage access
    fn key(env: &Env) -> BytesN<32> {
        let mut key_bytes = Bytes::new(&env);
        key_bytes.append(&Bytes::from_slice(&env, "job_storage".as_bytes()));
        let hash = env.crypto().sha256(&key_bytes);
        BytesN::from_array(&env, &hash.to_array())
    }
}

/// RATING_STORAGE is a Map<(Address, Address), Rating>
pub struct RatingStorage;

impl RatingStorage {
    const _STORAGE_KEY: &'static str = "rating_storage";

    pub fn add_rating(env: &Env, rating: &Rating) {
        let mut storage: Map<(Address, Address), Rating> = env
            .storage()
            .persistent()
            .get(&Self::key(env))
            .unwrap_or(Map::new(env));

        let key = (rating.freelancer.clone(), rating.client.clone());
        storage.set(key, rating.clone());
        env.storage().persistent().set(&Self::key(env), &storage);
    }

    pub fn get_ratings_for_freelancer(env: &Env, freelancer: &Address) -> Vec<Rating> {
        let storage: Map<(Address, Address), Rating> = env
            .storage()
            .persistent()
            .get(&Self::key(env))
            .unwrap_or(Map::new(env));

        let mut ratings = Vec::new(&env);
        for ((rating_freelancer, _), rating) in storage.iter() {
            if rating_freelancer == *freelancer {
                ratings.push_back(rating);
            }
        }
        ratings
    }

    pub fn calculate_average_rating(env: &Env, freelancer: &Address) -> u32 {
        let ratings = Self::get_ratings_for_freelancer(env, freelancer);
        
        if ratings.is_empty() {
            return 0;
        }

        let mut total: u64 = 0;
        for rating in ratings.iter() {
            total += rating.rating as u64;
        }

        (total / ratings.len() as u64) as u32
    }

    // Helper function to generate the key for storage access
    fn key(env: &Env) -> BytesN<32> {
        let mut key_bytes = Bytes::new(&env);
        key_bytes.append(&Bytes::from_slice(&env, "rating_storage".as_bytes()));
        let hash = env.crypto().sha256(&key_bytes);
        BytesN::from_array(&env, &hash.to_array())
    }
}
