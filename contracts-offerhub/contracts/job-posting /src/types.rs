use soroban_sdk::{Address, String, Env, contracterror, contracttype};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct JobData {
  pub owner: Address,
  pub title: String,
  pub description: String,
  pub budget: u64,
  pub timestamp: u64,
  pub status: JobStatus, // enum: Open | Closed
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum JobStatus {
    OPEN ,
    CLOSED
}