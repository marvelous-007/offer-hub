#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, Symbol};

mod access;
mod events;
mod metadata;
mod contract;
mod storage;
mod test;
mod types;

pub use crate::contract::ReputationNFTContract;
pub use types::Error;
pub use types::Metadata;
pub use types::TokenId;

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    #[allow(clippy::too_many_arguments)]
    pub fn init(env: Env, admin: Address) -> Result<(), Error> {
        ReputationNFTContract::init(env, admin)
    }

    #[allow(clippy::too_many_arguments)]
    pub fn mint(
        env: Env,
        caller: Address,
        to: Address,
        token_id: TokenId,
        name: String,
        description: String,
        uri: String,
    ) -> Result<(), Error> {
        ReputationNFTContract::mint(env, caller, to, token_id, name, description, uri)
    }

    pub fn transfer(env: Env, from: Address, to: Address, token_id: TokenId) -> Result<(), Error> {
        ReputationNFTContract::transfer(env, from, to, token_id)
    }

    pub fn get_owner(env: Env, token_id: TokenId) -> Result<Address, Error> {
        ReputationNFTContract::get_owner(env, token_id)
    }

    pub fn get_metadata(env: Env, token_id: TokenId) -> Result<Metadata, Error> {
        ReputationNFTContract::get_metadata(env, token_id)
    }

    pub fn get_meta(env: Env, token_id: TokenId) -> Result<Metadata, Error> {
        ReputationNFTContract::get_metadata(env, token_id)
    }

    pub fn add_minter(env: Env, caller: Address, minter: Address) -> Result<(), Error> {
        ReputationNFTContract::add_minter(env, caller, minter)
    }

    pub fn add_mint(env: Env, caller: Address, minter: Address) -> Result<(), Error> {
        ReputationNFTContract::add_minter(env, caller, minter)
    }

    pub fn remove_minter(env: Env, caller: Address, minter: Address) -> Result<(), Error> {
        ReputationNFTContract::remove_minter(env, caller, minter)
    }

    pub fn rem_mint(env: Env, caller: Address, minter: Address) -> Result<(), Error> {
        ReputationNFTContract::remove_minter(env, caller, minter)
    }

    pub fn is_minter(env: Env, address: Address) -> Result<bool, Error> {
        ReputationNFTContract::is_minter(env, address)
    }

    pub fn get_admin(env: Env) -> Result<Address, Error> {
        ReputationNFTContract::get_admin(env)
    }

    pub fn transfer_admin(env: Env, caller: Address, new_admin: Address) -> Result<(), Error> {
        ReputationNFTContract::transfer_admin(env, caller, new_admin)
    }

    pub fn tr_admin(env: Env, caller: Address, new_admin: Address) -> Result<(), Error> {
        ReputationNFTContract::transfer_admin(env, caller, new_admin)
    }

    pub fn req_auth(_env: Env, _addr: Address) -> Result<(), Error> {
        Ok(())
    }

    pub fn mint_achv(env: Env, caller: Address, to: Address, nft_type: Symbol) -> Result<(), Error> {
        ReputationNFTContract::mint_achv(env, caller, to, nft_type)
    }
}
