use soroban_sdk::{contracttype, Address, String, Env};

/// Represents a rating given by one user to another for a specific job
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RatingData {
    pub rater: Address,
    pub job_id: u32,
    pub score: i32,
    pub comment: String,
    pub timestamp: u64,
}

/// Error types for the Rating Contract
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Error {
    InvalidScore,
    DuplicateRating,
    JobNotCompleted,
    NotJobParticipant,
    Unauthorized,
    UserNotFound,
}

/// Storage keys for the contract's persistent data
pub const RATING_KEY_PREFIX: &[u8] = b"RATING";
pub const USER_RATINGS_PREFIX: &[u8] = b"USER_RATINGS";
