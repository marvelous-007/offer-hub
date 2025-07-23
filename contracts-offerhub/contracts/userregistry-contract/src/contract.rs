use crate::events::emit_user_registered;
use crate::storage::{get_verified_users, set_verified_users};
use crate::types::{require_auth, Error};
use soroban_sdk::{Address, Env};

pub struct UserRegistryContract;

impl UserRegistryContract {
    pub fn register_verified_user(env: Env, user: Address) -> Result<(), Error> {
        require_auth(&env, &user)?;
        let mut users = get_verified_users(&env);
        if users.contains_key(user.clone()) {
            return Err(Error::AlreadyRegistered);
        }
        users.set(user.clone(), true);
        set_verified_users(&env, &users);
        emit_user_registered(&env, &user);
        Ok(())
    }

    pub fn is_verified(env: Env, user: Address) -> bool {
        let users = get_verified_users(&env);
        users.get(user).unwrap_or(false)
    }
} 