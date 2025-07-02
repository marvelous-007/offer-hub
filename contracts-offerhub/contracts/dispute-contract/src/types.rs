use soroban_sdk::{contracterror, contracttype, Address};

#[contracttype]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum DisputeOutcome {
    None,
    FavorFreelancer,
    FavorClient,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DisputeData {
    pub initiator: Address,
    pub reason: soroban_sdk::String,
    pub timestamp: u64,
    pub resolved: bool,
    pub outcome: DisputeOutcome,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    DisputeAlreadyExists = 4,
    DisputeNotFound = 5,
    DisputeAlreadyResolved = 6,
}
