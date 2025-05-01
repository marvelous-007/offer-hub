use soroban_sdk::{Address, Env, String};
use crate::{TokenId, Metadata, Error};
use crate::storage::{save_token_owner, get_token_owner, token_exists, save_admin, get_admin, is_minter};
use crate::events::{emit_minted, emit_transferred};
use crate::access::{check_minter, check_owner, transfer_admin as transfer_admin_impl, add_minter as add_minter_impl, remove_minter as remove_minter_impl};
use crate::metadata::{store_metadata, get_metadata as get_token_metadata};

pub struct NFTContract;

impl NFTContract {
    pub fn init(env: Env, admin: Address) -> Result<(), Error> {
        save_admin(&env, &admin);
        Ok(())
    }

    pub fn mint(
        env: Env,
        caller: Address,
        to: Address,
        token_id: TokenId,
        name: String,
        description: String,
        uri: String,
    ) -> Result<(), Error> {
        // Check if the caller is authorized to mint
        check_minter(&env, &caller)?;

        // Check if token already exists
        if token_exists(&env, &token_id) {
            return Err(Error::TokenAlreadyExists);
        }

        // Store ownership
        save_token_owner(&env, &token_id, &to);

        // Store metadata
        store_metadata(&env, &token_id, name, description, uri)?;

        // Emit event
        emit_minted(&env, &to, &token_id);

        Ok(())
    }

    pub fn transfer(env: Env, from: Address, to: Address, token_id: TokenId) -> Result<(), Error> {
        // Check if token exists and get owner
        let owner = get_token_owner(&env, &token_id)?;
        
        // Validate that from is the owner
        if owner != from {
            return Err(Error::Unauthorized);
        }
        
        // Check authorization from the owner
        check_owner(&env, &from)?;

        // Update ownership
        save_token_owner(&env, &token_id, &to);

        // Emit transferred event
        emit_transferred(&env, &from, &to, &token_id);

        Ok(())
    }

    pub fn get_owner(env: Env, token_id: TokenId) -> Result<Address, Error> {
        get_token_owner(&env, &token_id)
    }

    pub fn get_metadata(env: Env, token_id: TokenId) -> Result<Metadata, Error> {
        get_token_metadata(&env, &token_id)
    }

    pub fn add_minter(env: Env, caller: Address, minter: Address) -> Result<(), Error> {
        add_minter_impl(&env, &caller, &minter)
    }

    pub fn remove_minter(env: Env, caller: Address, minter: Address) -> Result<(), Error> {
        remove_minter_impl(&env, &caller, &minter)
    }

    pub fn is_minter(env: Env, address: Address) -> Result<bool, Error> {
        Ok(is_minter(&env, &address))
    }

    pub fn get_admin(env: Env) -> Result<Address, Error> {
        Ok(get_admin(&env))
    }

    pub fn transfer_admin(env: Env, caller: Address, new_admin: Address) -> Result<(), Error> {
        transfer_admin_impl(&env, &caller, &new_admin)
    }
} 