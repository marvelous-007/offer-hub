use crate::storage::{get_token_metadata, save_token_metadata};
use crate::{Error, Metadata, TokenId};
use soroban_sdk::{Env, String};

pub fn store_metadata(
    env: &Env,
    token_id: &TokenId,
    name: String,
    description: String,
    uri: String,
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
