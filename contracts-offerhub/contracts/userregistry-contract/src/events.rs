use soroban_sdk::{Address, Env, Symbol};

pub fn emit_user_registered(env: &Env, user: &Address) {
    let topic = Symbol::new(env, "USER_REGISTERED");
    env.events().publish((topic,), user.clone());
} 