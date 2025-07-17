use crate::types::RewardData;
use soroban_sdk::{Address, Env, String, Symbol, Vec};

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage()
        .instance()
        .set(&Symbol::new(env, "admin"), admin);
}

pub fn get_admin(env: &Env) -> Option<Address> {
    env.storage().instance().get(&Symbol::new(env, "admin"))
}

pub fn get_user_rewards(env: &Env, user: &Address) -> Vec<RewardData> {
    let key = (Symbol::new(env, "user_rewards"), user);
    env.storage()
        .persistent()
        .get(&key)
        .unwrap_or_else(|| Vec::new(env))
}

pub fn add_user_reward(env: &Env, user: &Address, reward: &RewardData) {
    let key = (Symbol::new(env, "user_rewards"), user);
    let mut rewards = get_user_rewards(env, user);
    rewards.push_back(reward.clone());
    env.storage().persistent().set(&key, &rewards);
}

pub fn is_event_claimed(env: &Env, user: &Address, event_key: &String) -> bool {
    let key = (Symbol::new(env, "claimed"), user, event_key.clone());
    env.storage().persistent().has(&key)
}

pub fn mark_event_claimed(env: &Env, user: &Address, event_key: &String, timestamp: u64) {
    let key = (Symbol::new(env, "claimed"), user, event_key.clone());
    env.storage().persistent().set(&key, &timestamp);
}
