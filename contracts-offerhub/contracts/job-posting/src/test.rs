#![cfg(test)]

use super::*;
use crate::{JobPostingContract, JobPostingContractClient};
use soroban_sdk::{
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    Address, Env, IntoVal, String,
};

fn setup_contract<'a>() -> (Env, JobPostingContractClient<'a>) {
    let env = Env::default();
    let contract_id = env.register(JobPostingContract, ());
    let client: JobPostingContractClient<'a> = JobPostingContractClient::new(&env, &contract_id);
    (env, client)
}

#[test]
fn test_post_and_get_job_success() {
    let (e, client) = setup_contract();

    let owner = Address::generate(&e);
    let title = String::from_str(&e, "Blockchain Developer");
    let description = String::from_str(&e, "Build smart contracts");
    let budget = 1000;

    let job_id = client.post_job(&owner, &title, &description, &budget);

    assert_eq!(job_id, 1);

    let job = client.get_job(&job_id);

    assert_eq!(job.owner, owner);
    assert_eq!(job.title, title);
    assert_eq!(job.description, description);
    assert_eq!(job.budget, budget);
    assert_eq!(job.status, JobStatus::OPEN);
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn test_post_job_invalid_input() {
    let (e, client) = setup_contract();

    let owner = Address::generate(&e);
    let empty = String::from_str(&e, "");
    let valid = String::from_str(&e, "desc");

    client.post_job(&owner, &empty, &valid, &100);

    client.post_job(&owner, &valid, &empty, &100);

    client.post_job(&owner, &valid, &valid, &0);
}

#[test]
#[should_panic(expected = "Error(Contract, #3)")]
fn test_get_job_not_found() {
    let (_e, client) = setup_contract();

    client.get_job(&999);
}

#[test]
fn test_close_job_success() {
    let (e, client) = setup_contract();

    let owner = Address::generate(&e);
    let title = String::from_str(&e, "Rust Dev");
    let desc = String::from_str(&e, "Write Soroban contracts");
    let budget = 500;

    let job_id = client.post_job(&owner, &title, &desc, &budget);

    e.mock_auths(&[MockAuth {
        address: &owner,
        invoke: &MockAuthInvoke {
            contract: &client.address,
            fn_name: "close_job",
            args: (job_id.clone(),).into_val(&e),
            sub_invokes: &[],
        },
    }]);
    client.close_job(&job_id);

    let job = client.get_job(&job_id);
    assert_eq!(job.status, JobStatus::CLOSED);
}

#[test]
#[should_panic(expected = "Error(Auth, InvalidAction)")]
fn test_close_job_unauthorized() {
    let (e, client) = setup_contract();

    let owner = Address::generate(&e);
    let not_owner = Address::generate(&e);
    let title = String::from_str(&e, "Solidity Dev");
    let desc = String::from_str(&e, "Write contracts");
    let budget = 800;

    let job_id = client.post_job(&owner, &title, &desc, &budget);

    e.mock_auths(&[MockAuth {
        address: &not_owner,
        invoke: &MockAuthInvoke {
            contract: &client.address,
            fn_name: "close_job",
            args: (job_id.clone(),).into_val(&e),
            sub_invokes: &[],
        },
    }]);
    client.close_job(&job_id);
}

#[test]
#[should_panic(expected = "Error(Contract, #4)")]
fn test_close_job_already_closed() {
    let (e, client) = setup_contract();

    let owner = Address::generate(&e);
    let title = String::from_str(&e, "AI Researcher");
    let desc = String::from_str(&e, "Train ML models");
    let budget = 900;

    let job_id = client.post_job(&owner, &title, &desc, &budget);

    e.mock_auths(&[MockAuth {
        address: &owner,
        invoke: &MockAuthInvoke {
            contract: &client.address,
            fn_name: "close_job",
            args: (job_id.clone(),).into_val(&e),
            sub_invokes: &[],
        },
    }]);
    client.close_job(&job_id);

    e.mock_auths(&[MockAuth {
        address: &owner,
        invoke: &MockAuthInvoke {
            contract: &client.address,
            fn_name: "close_job",
            args: (job_id.clone(),).into_val(&e),
            sub_invokes: &[],
        },
    }]);
    client.close_job(&job_id);
}
