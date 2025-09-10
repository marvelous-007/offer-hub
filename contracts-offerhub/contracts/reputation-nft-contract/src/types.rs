use soroban_sdk::{contracterror, contracttype, Address, Env, String};
use crate::error::Error;
pub type TokenId = u64;

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Metadata {
    pub name: String,
    pub description: String,
    pub uri: String,
}

pub const TOKEN_OWNER: &[u8] = &[0];
pub const TOKEN_METADATA: &[u8] = &[1];
pub const ADMIN: &[u8] = &[2];
pub const MINTER: &[u8] = &[3];

pub fn require_auth(_env: &Env, address: &Address) -> Result<(), Error> {
    address.require_auth();
    Ok(())
}
