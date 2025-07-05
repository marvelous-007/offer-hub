use soroban_sdk::{Address, Env, Vec, BytesN, Bytes};
use crate::RatingData;

/// Save a rating to storage
pub fn save_rating(env: &Env, rating: &RatingData) {
    let key = create_rating_key(env, &rating.rater, rating.job_id);
    env.storage().persistent().set(&key, rating);
}

/// Check if a rating already exists for a specific rater and job
pub fn rating_exists(env: &Env, rater: &Address, job_id: u32) -> bool {
    let key = create_rating_key(env, rater, job_id);
    env.storage().persistent().has(&key)
}

/// Get all ratings for a user
pub fn get_user_ratings(env: &Env, target: &Address) -> Vec<RatingData> {
    let user_key = create_user_key(env, target);
    env.storage().persistent().get(&user_key).unwrap_or_else(|| Vec::new(env))
}

/// Save the list of ratings for a user
pub fn save_user_ratings(env: &Env, target: &Address, ratings: &Vec<RatingData>) {
    let user_key = create_user_key(env, target);
    env.storage().persistent().set(&user_key, ratings);
}

/// Create a unique key for a rating
fn create_rating_key(env: &Env, rater: &Address, job_id: u32) -> BytesN<32> {
    // Create a unique key by combining prefix, address (as its own hash), and job_id
    let mut key = Bytes::new(env);
    key.extend_from_slice(b"RATING_");
    
    // Serialize the rater address as bytes the best we can
    // Since we can't access internal bytes directly, we'll use the address itself
    // as an input to hash function to create a unique representation
    key.extend_from_slice(&env.crypto().sha256(&Bytes::from_array(
        env,
        &rater.to_string().as_bytes()
    )).into());
    
    // Add job ID
    key.extend_from_slice(&job_id.to_be_bytes());
    
    // Create a fixed-size hash
    let hash = env.crypto().sha256(&key);
    BytesN::from_array(env, &hash.into())
}

/// Create a unique key for a user's ratings
fn create_user_key(env: &Env, target: &Address) -> BytesN<32> {
    // Create a unique key for user ratings
    let mut key = Bytes::new(env);
    key.extend_from_slice(b"USER_RATINGS_");
    
    // Serialize the target address as bytes the best we can
    key.extend_from_slice(&env.crypto().sha256(&Bytes::from_array(
        env,
        &target.to_string().as_bytes()
    )).into());
    
    // Create a fixed-size hash
    let hash = env.crypto().sha256(&key);
    BytesN::from_array(env, &hash.into())
}
