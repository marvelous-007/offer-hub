use soroban_sdk::{contracttype, Address, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PublicationData {
    pub publication_type: Symbol,
    pub title: String,
    pub category: String,
    pub amount: i128,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    UserPostCount(Address),
    Publication(Address, u32),
}
