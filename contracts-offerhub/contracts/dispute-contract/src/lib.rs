#![no_std]

mod dispute;
mod storage;
mod test;
mod types;

use crate::types::{DisputeData, DisputeOutcome, Error};
use soroban_sdk::{contract, contractimpl, Address, Env, String};

#[contract]
pub struct DisputeResolutionContract;

#[contractimpl]
impl DisputeResolutionContract {
    pub fn initialize(env: Env, arbitrator: Address) -> Result<(), Error> {
        dispute::initialize(&env, arbitrator);
        Ok(())
    }

    pub fn open_dispute(
        env: Env,
        job_id: u32,
        initiator: Address,
        reason: String,
    ) -> Result<(), Error> {
        dispute::open_dispute(&env, job_id, initiator, reason);
        Ok(())
    }

    pub fn get_dispute(env: Env, job_id: u32) -> Result<DisputeData, Error> {
        Ok(dispute::get_dispute(&env, job_id))
    }

    pub fn resolve_dispute(env: Env, job_id: u32, decision: DisputeOutcome) -> Result<(), Error> {
        dispute::resolve_dispute(&env, job_id, decision);
        Ok(())
    }
}
