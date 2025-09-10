use soroban_sdk::{contracterror, panic_with_error, Env};

#[contracterror]
#[derive(Copy, Clone, Eq, PartialEq, Debug)]
pub enum Error {
    AlreadyInitialized = 1,
    InvalidArbitrator = 2,
    Unauthorized = 3,
    InvalidTimeout = 4,
    DisputeAlreadyExists = 5,
    DisputeNotFound = 6,
    DisputeAlreadyResolved = 7,
    InvalidDisputeLevel = 8,
    NotInitialized = 9,
    MediationRequired = 10,
    ArbitrationRequired = 11,
    EvidenceNotFound = 12,
    RateLimitExceeded = 13
}

pub fn handle_error(env: &Env, error: Error) -> ! {
    panic_with_error!(env, error);
}
