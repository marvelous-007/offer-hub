use soroban_sdk::{Address, Env, String, Vec};
use crate::types::{RewardData, Error, require_auth};
use crate::storage::{
    set_admin, get_admin, get_user_rewards, add_user_reward, 
    is_event_claimed, mark_event_claimed
};
use crate::events::{emit_reward_claimed, emit_contract_initialized};

pub struct TokenRewardContract;

impl TokenRewardContract {
    pub fn init(env: Env, admin: Address) -> Result<(), Error> {
        require_auth(&env, &admin)?;
        
        if get_admin(&env).is_some() {
            return Err(Error::Unauthorized);
        }
        
        set_admin(&env, &admin);
        emit_contract_initialized(&env, &admin);
        
        Ok(())
    }

    pub fn claim_reward(env: Env, user: Address, event_key: String) -> Result<(), Error> {
        require_auth(&env, &user)?;
        
        // Check if reward already claimed for this event
        if is_event_claimed(&env, &user, &event_key) {
            return Err(Error::RewardAlreadyClaimed);
        }
        
        // Validate event key (basic validation - you can extend this)
        if event_key.len() == 0 {
            return Err(Error::InvalidEvent);
        }
        
        let timestamp = env.ledger().timestamp();
        
        // Create reward data
        let reward = RewardData {
            event_key: event_key.clone(),
            timestamp,
        };
        
        // Store the reward
        add_user_reward(&env, &user, &reward);
        mark_event_claimed(&env, &user, &event_key, timestamp);
        
        // Emit event
        emit_reward_claimed(&env, &user, &event_key, timestamp);
        
        Ok(())
    }

    pub fn get_rewards(env: Env, address: Address) -> Vec<RewardData> {
        get_user_rewards(&env, &address)
    }

    pub fn has_claimed(env: Env, address: Address, event_key: String) -> bool {
        is_event_claimed(&env, &address, &event_key)
    }

    pub fn get_admin(env: Env) -> Result<Address, Error> {
        get_admin(&env).ok_or(Error::NotInitialized)
    }
} 