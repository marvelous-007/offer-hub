use soroban_sdk::{Address, Env, String, Symbol};

pub fn emit_reward_claimed(env: &Env, user: &Address, event_key: &String, timestamp: u64) {
    env.events().publish(
        (Symbol::new(env, "reward"), Symbol::new(env, "claimed")),
        (user, event_key.clone(), timestamp)
    );
}

pub fn emit_contract_initialized(env: &Env, admin: &Address) {
    env.events().publish(
        (Symbol::new(env, "contract"), Symbol::new(env, "init")),
        admin
    );
} 