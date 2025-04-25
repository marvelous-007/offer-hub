use soroban_sdk::{Address, Env, Map, Bytes, BytesN};
use crate::{TokenId, Metadata, Error};
use crate::types::{TOKEN_OWNER, TOKEN_METADATA, ADMIN, MINTER};

pub fn save_token_owner(env: &Env, token_id: &TokenId, owner: &Address) {
    let key_bytes = create_token_key(env, TOKEN_OWNER, token_id);
    env.storage().persistent().set(&key_bytes, owner);
}

pub fn get_token_owner(env: &Env, token_id: &TokenId) -> Result<Address, Error> {
    let key_bytes = create_token_key(env, TOKEN_OWNER, token_id);
    if let Some(owner) = env.storage().persistent().get::<BytesN<32>, Address>(&key_bytes) {
        return Ok(owner);
    }
    Err(Error::TokenDoesNotExist)
}

pub fn token_exists(env: &Env, token_id: &TokenId) -> bool {
    let key_bytes = create_token_key(env, TOKEN_OWNER, token_id);
    env.storage().persistent().has(&key_bytes)
}

pub fn save_token_metadata(env: &Env, token_id: &TokenId, metadata: &Metadata) {
    let key_bytes = create_token_key(env, TOKEN_METADATA, token_id);
    env.storage().persistent().set(&key_bytes, metadata);
}

pub fn get_token_metadata(env: &Env, token_id: &TokenId) -> Result<Metadata, Error> {
    let key_bytes = create_token_key(env, TOKEN_METADATA, token_id);
    if let Some(metadata) = env.storage().persistent().get::<BytesN<32>, Metadata>(&key_bytes) {
        return Ok(metadata);
    }
    Err(Error::TokenDoesNotExist)
}

fn create_token_key(env: &Env, prefix: &[u8], token_id: &TokenId) -> BytesN<32> {
    let mut key_data = Bytes::new(env);
    key_data.extend_from_slice(prefix);
    key_data.extend_from_slice(&token_id.to_be_bytes());
    let hash = env.crypto().sha256(&key_data);
    BytesN::from_array(env, &hash.into())
}

pub fn save_admin(env: &Env, admin: &Address) {
    let key_bytes = create_simple_key(env, ADMIN);
    env.storage().persistent().set(&key_bytes, admin);
}

pub fn get_admin(env: &Env) -> Address {
    let key_bytes = create_simple_key(env, ADMIN);
    env.storage().persistent().get(&key_bytes).unwrap()
}

pub fn is_admin(env: &Env, address: &Address) -> bool {
    let admin = get_admin(env);
    &admin == address
}

pub fn add_minter(env: &Env, minter: &Address) {
    let key_bytes = create_simple_key(env, MINTER);
    let mut minters = get_minters(env);
    minters.set(minter.clone(), true);
    env.storage().persistent().set(&key_bytes, &minters);
}

pub fn remove_minter(env: &Env, minter: &Address) {
    let key_bytes = create_simple_key(env, MINTER);
    let mut minters = get_minters(env);
    minters.remove(minter.clone());
    env.storage().persistent().set(&key_bytes, &minters);
}

pub fn is_minter(env: &Env, address: &Address) -> bool {
    let minters = get_minters(env);
    minters.contains_key(address.clone())
}

fn get_minters(env: &Env) -> Map<Address, bool> {
    let key_bytes = create_simple_key(env, MINTER);
    env.storage().persistent().get(&key_bytes).unwrap_or_else(|| Map::new(env))
}

fn create_simple_key(env: &Env, key_data: &[u8]) -> BytesN<32> {
    let mut key_bytes = Bytes::new(env);
    key_bytes.extend_from_slice(key_data);
    let hash = env.crypto().sha256(&key_bytes);
    BytesN::from_array(env, &hash.into())
} 