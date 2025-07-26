use soroban_sdk::{Address, Env, Map, Symbol, symbol_short};

pub const VERIFIED_USERS: Symbol = symbol_short!("VERIFIED");

pub fn get_verified_users(env: &Env) -> Map<Address, bool> {
    env.storage()
        .instance()
        .get(&VERIFIED_USERS)
        .unwrap_or_else(|| Map::new(env))
}

pub fn set_verified_users(env: &Env, users: &Map<Address, bool>) {
    env.storage().instance().set(&VERIFIED_USERS, users);
} 