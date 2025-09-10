use soroban_sdk::{contracterror};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    /// Caller is not authorized to perform this action
    Unauthorized = 1,
    /// User is already registered in the system
    AlreadyRegistered = 2,
    /// User account not found
    UserNotFound = 3,
    /// User is already on the blacklist
    AlreadyBlacklisted = 4,
    /// User is not on the blacklist
    NotBlacklisted = 5,
    /// Invalid verification level provided
    InvalidVerificationLevel = 6,
    /// User verification has expired
    VerificationExpired = 7,
    /// Contract has not been initialized
    NotInitialized = 8,
    /// Contract has already been initialized
    AlreadyInitialized = 9,
    /// Cannot blacklist admin accounts
    CannotBlacklistAdmin = 10,
    /// Cannot blacklist moderator accounts
    CannotBlacklistModerator = 11,
    /// User profile is not published
    ProfileNotPublished = 12,
    /// User profile is already published
    ProfileAlreadyPublished = 13,
    /// Validation check failed
    ValidationFailed = 14,
    /// Invalid data provided for validation
    InvalidValidationData = 15,
    /// Rate limit exceeded for this operation
    RateLimitExceeded = 16,
    /// An unexpected error occurred
    UnexpectedError = 17,
}