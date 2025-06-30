#![no_std]
use crate::error::JobPostingError;
use crate::events::{emit_job_post_closed, emit_job_post_open};
use crate::types::{Datakey, JobData, JobStatus};
use soroban_sdk::{contract, contractimpl, Address, Env, String};

#[contract]
pub struct JobPostingContract;

#[contractimpl]
impl JobPostingContract {
    pub fn post_job(
        e: Env,
        owner: Address,
        title: String,
        description: String,
        budget: u64,
    ) -> Result<u32, JobPostingError> {
        if title.len() == 0 || description.len() == 0 || budget == 0 {
            return Err(JobPostingError::InvalidInput);
        }

        let mut job_id: u32 = e.storage().persistent().get(&Datakey::COUNTER).unwrap_or(0);
        job_id += 1;
        e.storage().persistent().set(&Datakey::COUNTER, &job_id);

        let timestamp: u64 = e.ledger().timestamp();

        let job = JobData {
            owner: owner.clone(),
            title,
            description,
            budget,
            timestamp,
            status: JobStatus::OPEN,
        };

        e.storage()
            .persistent()
            .set(&Datakey::JOBPOST(job_id), &job);

        emit_job_post_open(&e, &owner, &job_id, budget, timestamp);

        Ok(job_id)
    }

    pub fn get_job(e: Env, job_id: u32) -> Result<JobData, JobPostingError> {
        match e.storage().persistent().get(&Datakey::JOBPOST(job_id)) {
            Some(x) => x,
            None => Err(JobPostingError::JobNotFound),
        }
    }

    pub fn close_job(e: Env, job_id: u32, caller: Address) -> Result<(), JobPostingError> {
        let mut job: JobData = match e.storage().persistent().get(&Datakey::JOBPOST(job_id)) {
            Some(x) => x,
            None => return Err(JobPostingError::JobNotFound),
        };

        if job.owner != caller {
            return Err(JobPostingError::Unauthorized);
        }

        if job.status == JobStatus::CLOSED {
            return Err(JobPostingError::AlreadyClosed);
        }

        job.status = JobStatus::CLOSED;

        e.storage()
            .persistent()
            .set(&Datakey::JOBPOST(job_id), &job);

        emit_job_post_closed(&e, &job.owner, &job_id);

        Ok(())
    }
}

mod error;
mod events;
mod types;
