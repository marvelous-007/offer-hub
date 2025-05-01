use soroban_sdk::{Address, Env, Symbol};
use crate::TokenId;

pub fn emit_minted(env: &Env, to: &Address, token_id: &TokenId) {
    let topic = Symbol::new(env, "MINTED");
    env.events().publish((topic,), (to.clone(), token_id));
}

pub fn emit_transferred(env: &Env, from: &Address, to: &Address, token_id: &TokenId) {
    let topic = Symbol::new(env, "TRANSFER");
    env.events().publish((topic,), (from.clone(), to.clone(), token_id));
}

pub fn emit_admin_changed(env: &Env, old_admin: &Address, new_admin: &Address) {
    let topic = Symbol::new(env, "ADMIN");
    env.events().publish((topic,), (old_admin.clone(), new_admin.clone()));
}

pub fn emit_minter_added(env: &Env, admin: &Address, minter: &Address) {
    let topic = Symbol::new(env, "ADDMINTR");
    env.events().publish((topic,), (admin.clone(), minter.clone()));
}

pub fn emit_minter_removed(env: &Env, admin: &Address, minter: &Address) {
    let topic = Symbol::new(env, "REMMINTR");
    env.events().publish((topic,), (admin.clone(), minter.clone()));
} 