use crate::types::{
    Error, Feedback, IncentiveRecord, Rating, RatingStats, RatingThreshold,
    FeedbackReport, ADMIN, MODERATOR, RATING, FEEDBACK, USER_RATING_STATS,
    USER_RATINGS, CONTRACT_RATINGS, FEEDBACK_REPORTS, RATING_THRESHOLDS,
    INCENTIVE_RECORDS, REPUTATION_CONTRACT, PLATFORM_STATS, USER_RESTRICTIONS,
};
use soroban_sdk::{Address, Env, String, Vec};

// Admin and moderator management
pub fn save_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&ADMIN, admin);
}

pub fn get_admin(env: &Env) -> Address {
    env.storage().instance().get(&ADMIN).unwrap()
}

pub fn save_moderator(env: &Env, moderator: &Address) {
    let key = (MODERATOR, moderator);
    env.storage().persistent().set(&key, &true);
}

pub fn remove_moderator(env: &Env, moderator: &Address) {
    let key = (MODERATOR, moderator);
    env.storage().persistent().remove(&key);
}

pub fn is_moderator(env: &Env, address: &Address) -> bool {
    let key = (MODERATOR, address);
    env.storage().persistent().get(&key).unwrap_or(false)
}

// Rating storage
pub fn save_rating(env: &Env, rating: &Rating) {
    let key = (RATING, &rating.id);
    env.storage().persistent().set(&key, rating);
    
    // Also index by user and contract
    let user_key = (USER_RATINGS, &rating.rated_user, &rating.id);
    env.storage().persistent().set(&user_key, &true);
    
    let contract_key = (CONTRACT_RATINGS, &rating.contract_id, &rating.id);
    env.storage().persistent().set(&contract_key, &true);
}

pub fn get_rating(env: &Env, rating_id: &String) -> Result<Rating, Error> {
    let key = (RATING, rating_id);
    env.storage().persistent().get(&key).ok_or(Error::ContractNotFound)
}

pub fn rating_exists(env: &Env, rating_id: &String) -> bool {
    let key = (RATING, rating_id);
    env.storage().persistent().has(&key)
}

pub fn has_rated_contract(env: &Env, rater: &Address, contract_id: &String) -> bool {
    // Generate a simple check by iterating through user's ratings
    // In production, this could be optimized with better indexing
    let ratings = get_ratings_by_contract(env, contract_id);
    for rating_id in ratings.iter() {
        if let Ok(rating) = get_rating(env, rating_id) {
            if rating.rater == *rater {
                return true;
            }
        }
    }
    false
}

pub fn get_ratings_by_user(env: &Env, user: &Address) -> Vec<String> {
    // This would need proper iteration in production
    // For now, return empty vec - implementation depends on Soroban SDK capabilities
    Vec::new(env)
}

pub fn get_ratings_by_contract(env: &Env, contract_id: &String) -> Vec<String> {
    // This would need proper iteration in production
    // For now, return empty vec - implementation depends on Soroban SDK capabilities
    Vec::new(env)
}

// Feedback storage
pub fn save_feedback(env: &Env, feedback: &Feedback) {
    let key = (FEEDBACK, &feedback.id);
    env.storage().persistent().set(&key, feedback);
}

pub fn get_feedback(env: &Env, feedback_id: &String) -> Result<Feedback, Error> {
    let key = (FEEDBACK, feedback_id);
    env.storage().persistent().get(&key).ok_or(Error::FeedbackNotFound)
}

pub fn update_feedback(env: &Env, feedback: &Feedback) {
    let key = (FEEDBACK, &feedback.id);
    env.storage().persistent().set(&key, feedback);
}

// Rating statistics
pub fn save_user_rating_stats(env: &Env, stats: &RatingStats) {
    let key = (USER_RATING_STATS, &stats.user);
    env.storage().persistent().set(&key, stats);
}

pub fn get_user_rating_stats(env: &Env, user: &Address) -> Result<RatingStats, Error> {
    let key = (USER_RATING_STATS, user);
    env.storage().persistent().get(&key).ok_or(Error::InsufficientRatings)
}

// Feedback reports
pub fn save_feedback_report(env: &Env, report: &FeedbackReport) {
    let key = (FEEDBACK_REPORTS, &report.id);
    env.storage().persistent().set(&key, report);
}

pub fn get_feedback_report(env: &Env, report_id: &String) -> Result<FeedbackReport, Error> {
    let key = (FEEDBACK_REPORTS, report_id);
    env.storage().persistent().get(&key).ok_or(Error::FeedbackNotFound)
}

// Rating thresholds
pub fn save_rating_threshold(env: &Env, threshold: &RatingThreshold) {
    let key = (RATING_THRESHOLDS, &threshold.threshold_type);
    env.storage().persistent().set(&key, threshold);
}

pub fn get_rating_threshold(env: &Env, threshold_type: &String) -> Result<RatingThreshold, Error> {
    let key = (RATING_THRESHOLDS, threshold_type);
    env.storage().persistent().get(&key).ok_or(Error::ThresholdNotFound)
}

// Incentive records
pub fn save_incentive_record(env: &Env, record: &IncentiveRecord) {
    let key = (INCENTIVE_RECORDS, &record.user, &record.incentive_type);
    env.storage().persistent().set(&key, record);
}

pub fn get_incentive_record(env: &Env, user: &Address, incentive_type: &String) -> Result<IncentiveRecord, Error> {
    let key = (INCENTIVE_RECORDS, user, incentive_type);
    env.storage().persistent().get(&key).ok_or(Error::IncentiveNotFound)
}

// Reputation contract integration
pub fn save_reputation_contract(env: &Env, contract_address: &Address) {
    env.storage().instance().set(&REPUTATION_CONTRACT, contract_address);
}

pub fn get_reputation_contract(env: &Env) -> Result<Address, Error> {
    env.storage().instance().get(&REPUTATION_CONTRACT).ok_or(Error::ReputationContractNotSet)
}

// User restrictions
pub fn save_user_restriction(env: &Env, user: &Address, restriction: &String) {
    let key = (USER_RESTRICTIONS, user);
    env.storage().persistent().set(&key, restriction);
}

pub fn get_user_restriction(env: &Env, user: &Address) -> String {
    let key = (USER_RESTRICTIONS, user);
    env.storage().persistent().get(&key).unwrap_or_else(|| String::from_str(env, "none"))
}

// Platform statistics
pub fn increment_platform_stat(env: &Env, stat_name: &String) {
    let key = (PLATFORM_STATS, stat_name);
    let current: u32 = env.storage().persistent().get(&key).unwrap_or(0);
    env.storage().persistent().set(&key, &(current + 1));
}

pub fn get_platform_stat(env: &Env, stat_name: &String) -> u32 {
    let key = (PLATFORM_STATS, stat_name);
    env.storage().persistent().get(&key).unwrap_or(0)
}
