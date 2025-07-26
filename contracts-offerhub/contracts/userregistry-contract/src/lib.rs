#![no_std]

mod contract;
mod events;
mod storage;
mod types;
mod test;

use crate::contract::UserRegistryContract;
use crate::types::Error;
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn register_verified_user(env: Env, user: Address) -> Result<(), Error> {
        UserRegistryContract::register_verified_user(env, user)
    }

    pub fn is_verified(env: Env, user: Address) -> bool {
        UserRegistryContract::is_verified(env, user)
    }
} 