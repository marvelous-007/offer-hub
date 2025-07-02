use soroban_sdk::{contracttype, Address, String};

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
    OPEN,
    CLOSED,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq, Copy)]
pub enum Datakey {
    JOBPOST(u32),
    COUNTER,
}
