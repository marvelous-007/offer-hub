use crate::storage::{FreelancerStorage, Rating, RatingStorage};
use soroban_sdk::{Address, Env, String, Vec};

/// Add a rating for a freelancer.
pub fn add_rating(env: Env, freelancer: Address, client: Address, rating: u32, comment: String) {
    client.require_auth();

    // Verify freelancer exists
    if !FreelancerStorage::has(&env, &freelancer) {
        panic!("Freelancer not registered");
    }

    // Validate rating is between 1 and 5
    if rating < 1 || rating > 5 {
        panic!("Rating must be between 1 and 5");
    }

    let timestamp = env.ledger().timestamp();
    
    // Create rating record
    let rating_record = Rating {
        freelancer: freelancer.clone(),
        client: client.clone(),
        rating,
        comment,
        timestamp,
    };

    // Add rating to storage
    RatingStorage::add_rating(&env, &rating_record);
}

/// Get all ratings for a freelancer.
pub fn get_all_ratings(env: Env, freelancer: Address) -> Vec<Rating> {
    // Verify freelancer exists
    if !FreelancerStorage::has(&env, &freelancer) {
        panic!("Freelancer not registered");
    }

    RatingStorage::get_ratings_for_freelancer(&env, &freelancer)
}

/// Get average rating for a freelancer.
pub fn get_average_rating(env: Env, freelancer: Address) -> u32 {
    // Verify freelancer exists
    if !FreelancerStorage::has(&env, &freelancer) {
        panic!("Freelancer not registered");
    }

    RatingStorage::calculate_average_rating(&env, &freelancer)
}
