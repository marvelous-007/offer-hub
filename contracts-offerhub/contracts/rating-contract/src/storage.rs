use soroban_sdk::{Address, Env, Vec, BytesN, Bytes};
use soroban_sdk::xdr::ToXdr;
use crate::{RatingData, Error};
use crate::types::{RATING_KEY_PREFIX, USER_RATINGS_PREFIX};

/// Save a rating for a user and job
pub fn save_rating(env: &Env, target: &Address, job_id: u32, rating: &RatingData) {
    let rating_key = create_rating_key(env, target, job_id);
    env.storage().persistent().set(&rating_key, rating);
}

/// Check if a rating exists for a user and job
pub fn rating_exists(env: &Env, target: &Address, job_id: u32) -> bool {
    let rating_key = create_rating_key(env, target, job_id);
    env.storage().persistent().has(&rating_key)
}

/// Get a rating for a user and job
pub fn get_rating(env: &Env, target: &Address, job_id: u32) -> Result<RatingData, Error> {
    let rating_key = create_rating_key(env, target, job_id);
    if let Some(rating) = env.storage().persistent().get::<BytesN<32>, RatingData>(&rating_key) {
        return Ok(rating);
    }
    Err(Error::UserNotFound)
}

/// Save all ratings for a user
pub fn save_user_ratings(env: &Env, target: &Address, ratings: &Vec<RatingData>) {
    let user_key = create_user_key(env, target);
    env.storage().persistent().set(&user_key, ratings);
}

/// Get all ratings for a user
pub fn get_user_ratings(env: &Env, target: &Address) -> Vec<RatingData> {
    let user_key = create_user_key(env, target);
    env.storage().persistent().get(&user_key).unwrap_or_else(|| Vec::new(env))
}

/// Create a unique key for a rating
fn create_rating_key(env: &Env, target: &Address, job_id: u32) -> BytesN<32> {
    let mut key_data = Bytes::new(env);
    key_data.extend_from_slice(RATING_KEY_PREFIX);
    key_data.extend_from_slice(&target.to_xdr(env));
    key_data.extend_from_slice(&job_id.to_be_bytes());
    let hash = env.crypto().sha256(&key_data);
    BytesN::from_array(env, &hash.into())
}

/// Create a unique key for a user's ratings
fn create_user_key(env: &Env, target: &Address) -> BytesN<32> {
    let mut key_data = Bytes::new(env);
    key_data.extend_from_slice(USER_RATINGS_PREFIX);
    key_data.extend_from_slice(&target.to_xdr(env));
    let hash = env.crypto().sha256(&key_data);
    BytesN::from_array(env, &hash.into())
}
