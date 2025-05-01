use soroban_sdk::{String, Env};
use crate::{TokenId, Metadata, Error};
use crate::storage::{save_token_metadata, get_token_metadata};

pub fn store_metadata(
    env: &Env, 
    token_id: &TokenId, 
    name: String, 
    description: String, 
    uri: String
) -> Result<(), Error> {
    let metadata = Metadata {
        name,
        description,
        uri,
    };
    save_token_metadata(env, token_id, &metadata);
    Ok(())
}

pub fn get_metadata(env: &Env, token_id: &TokenId) -> Result<Metadata, Error> {
    get_token_metadata(env, token_id)
} 