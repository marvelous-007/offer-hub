use soroban_sdk::contracterror;

#[contracterror]
#[derive(Clone, Debug, Eq, PartialEq, Copy)]
#[repr(u32)]
pub enum JobPostingError {
    Unauthorized = 1,
    InvalidInput = 2,
    JobNotFound = 3,
    AlreadyClosed = 4,
}
