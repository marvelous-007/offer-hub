use soroban_sdk::{Address, Env, Vec, BytesN, Bytes};
use crate::{RatingData, Error};
use crate::types::{RATING_KEY_PREFIX, USER_RATINGS_PREFIX};

/// Save a rating to storage
pub fn save_rating(env: &Env, rating: &RatingData) {
    let key = create_rating_key(env, &rating.rater, &rating.job_id);
    env.storage().persistent().set(&key, rating);
}

/// Check if a rating already exists for a specific rater and job
pub fn rating_exists(env: &Env, rater: &Address, job_id: u32) -> bool {
    let key = create_rating_key(env, rater, &job_id);
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
fn create_rating_key(env: &Env, rater: &Address, job_id: &u32) -> BytesN<32> {
    let mut key_data = Bytes::new(env);
    key_data.extend_from_slice(RATING_KEY_PREFIX);
    // Convert Address to a byte representation for the key
    key_data.extend_from_slice(rater.to_string().as_bytes());
    key_data.extend_from_slice(&job_id.to_be_bytes());
    let hash = env.crypto().sha256(&key_data);
    BytesN::from_array(env, &hash.into())
}

/// Create a unique key for a user's ratings
fn create_user_key(env: &Env, target: &Address) -> BytesN<32> {
    let mut key_data = Bytes::new(env);
    key_data.extend_from_slice(USER_RATINGS_PREFIX);
    // Convert Address to a byte representation for the key
    key_data.extend_from_slice(target.to_string().as_bytes());
    let hash = env.crypto().sha256(&key_data);
    BytesN::from_array(env, &hash.into())
}
