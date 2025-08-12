#![no_std]

mod contract;
mod error;
mod storage;
mod types;

use types::{
    DisputeParams, EscrowCreateParams, MilestoneCreateParams, MilestoneCreateResult,
    MilestoneParams,
};

use soroban_sdk::{contract, contractimpl, Address, Env, Vec};

#[contract]
pub struct EscrowFactory;

#[contractimpl]
impl EscrowFactory {
    pub fn __constructor(env: Env) {
        contract::upload_escrow_wasm(env);
    }

    pub fn deploy_new_escrow(env: Env, create_params: EscrowCreateParams) -> Address {
        contract::deploy_new_escrow(env, create_params)
    }

    pub fn batch_deploy(env: Env, params: Vec<EscrowCreateParams>) -> Vec<Address> {
        contract::batch_deploy(env, params)
    }

    pub fn batch_deposit_funds(env: Env, escrow_ids: Vec<u32>, client: Address) {
        contract::batch_deposit_funds(env, escrow_ids, client);
    }

    pub fn batch_release_funds(env: Env, escrow_ids: Vec<u32>, freelancer: Address) {
        contract::batch_release_funds(env, escrow_ids, freelancer);
    }

    pub fn batch_create_disputes(env: Env, escrow_ids: Vec<u32>, caller: Address) {
        contract::batch_create_disputes(env, escrow_ids, caller);
    }

    pub fn batch_resolve_disputes(env: Env, dispute_params: Vec<DisputeParams>) {
        contract::batch_resolve_disputes(env, dispute_params);
    }

    pub fn batch_add_milestones(
        env: Env,
        milestone_create_params: Vec<MilestoneCreateParams>,
        client: Address,
    ) -> Vec<MilestoneCreateResult> {
        contract::batch_add_milestones(env, milestone_create_params, client)
    }

    pub fn batch_approve_milestones(
        env: Env,
        milestone_params: Vec<MilestoneParams>,
        client: Address,
    ) {
        contract::batch_approve_milestones(env, milestone_params, client);
    }

    pub fn batch_release_milestones(
        env: Env,
        milestone_params: Vec<MilestoneParams>,
        freelancer: Address,
    ) {
        contract::batch_release_milestones(env, milestone_params, freelancer);
    }

    pub fn batch_check_escrow_status(
        env: Env,
        escrow_ids: Vec<u32>,
    ) -> Vec<contract::escrow_contract::EscrowStatus> {
        contract::batch_check_escrow_status(env, escrow_ids)
    }

    pub fn batch_get_escrow_information(
        env: Env,
        escrow_ids: Vec<u32>,
    ) -> Vec<contract::escrow_contract::EscrowData> {
        contract::batch_get_escrow_information(env, escrow_ids)
    }

    pub fn get_escrow_id_by_address(env: Env, escrow_address: Address) -> Option<u32> {
        contract::get_escrow_id_by_address(env, escrow_address)
    }
}
