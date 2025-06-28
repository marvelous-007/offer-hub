use soroban_sdk::{Address, String, Env, contracterror, contracttype};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct RewardData {
    pub event_key: String,
    pub timestamp: u64,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    Unauthorized = 1,
    RewardAlreadyClaimed = 2,
    InvalidEvent = 3,
    NotInitialized = 4,
}

pub fn require_auth(_env: &Env, address: &Address) -> Result<(), Error> {
    address.require_auth();
    Ok(())
} 