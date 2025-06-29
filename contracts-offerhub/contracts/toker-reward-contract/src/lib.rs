#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address, String, Vec};

mod events;
mod reward;
mod storage;
mod types;

#[cfg(test)]
mod test;

pub use crate::reward::TokenRewardContract;
pub use types::{RewardData, Error};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    /// Initialize the contract with an admin
    pub fn init(env: Env, admin: Address) -> Result<(), Error> {
        TokenRewardContract::init(env, admin)
    }

    /// Allows a user to claim a reward based on a specific event
    /// Prevents duplicate claims for the same event per user
    pub fn claim_reward(env: Env, user: Address, event_key: String) -> Result<(), Error> {
        TokenRewardContract::claim_reward(env, user, event_key)
    }

    /// Retrieves all rewards claimed by the given address
    pub fn get_rewards(env: Env, address: Address) -> Vec<RewardData> {
        TokenRewardContract::get_rewards(env, address)
    }

    /// Returns whether a reward has already been claimed for a specific event
    pub fn has_claimed(env: Env, address: Address, event_key: String) -> bool {
        TokenRewardContract::has_claimed(env, address, event_key)
    }

    /// Get the admin address (for testing/verification purposes)
    pub fn get_admin(env: Env) -> Result<Address, Error> {
        TokenRewardContract::get_admin(env)
    }
}
