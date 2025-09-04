use soroban_sdk::{contracterror, contracttype, Address, Env, String, Vec};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    Unauthorized = 1,
    AlreadyRegistered = 2,
    UserNotFound = 3,
    AlreadyBlacklisted = 4,
    NotBlacklisted = 5,
    InvalidVerificationLevel = 6,
    VerificationExpired = 7,
    NotInitialized = 8,
    AlreadyInitialized = 9,
    CannotBlacklistAdmin = 10,
    CannotBlacklistModerator = 11,
    ProfileNotPublished = 12,
    ProfileAlreadyPublished = 13,
    ValidationFailed = 14,
    InvalidValidationData = 15,
    RateLimitExceeded = 16,
    UnexpectedError = 17,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum VerificationLevel {
    Basic = 1,
    Premium = 2,
    Enterprise = 3,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PublicationStatus {
    Private = 0,
    Published = 1,
    Verified = 2,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ValidationData {
    pub validator: Address,
    pub timestamp: u64,
    pub signature: String,
    pub metadata: String,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UserProfile {
    pub verification_level: VerificationLevel,
    pub verified_at: u64,
    pub expires_at: u64, // 0 means no expiration
    pub metadata: String,
    pub is_blacklisted: bool,
    pub publication_status: PublicationStatus,
    pub validations: Vec<ValidationData>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UserStatus {
    pub is_verified: bool,
    pub verification_level: VerificationLevel,
    pub is_blacklisted: bool,
    pub verification_expires_at: u64, // 0 means no expiration
    pub is_expired: bool,
    pub publication_status: PublicationStatus,
    pub validation_count: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UserDataExport {
    pub user_address: Address,
    pub has_profile: bool,
    pub profile: UserProfile, // We'll use a default profile if none exists
    pub status: UserStatus,
    pub export_timestamp: u64,
    pub export_version: String,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AllUsersExport {
    pub total_users: u64,
    pub verified_users: Vec<Address>,
    pub blacklisted_users: Vec<Address>,
    pub export_timestamp: u64,
    pub export_version: String,
    pub data_size_limit_reached: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ContractExportResult {
    pub contract_address: Address,
    pub contract_type: String,
    pub export_successful: bool,
    pub data_size: u32,
    pub error_message: Option<String>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PlatformDataExport {
    pub user_registry_summary: AllUsersExport,
    pub rating_contract_results: Vec<ContractExportResult>,
    pub escrow_contract_results: Vec<ContractExportResult>,
    pub dispute_contract_results: Vec<ContractExportResult>,
    pub total_contracts_processed: u32,
    pub successful_exports: u32,
    pub failed_exports: u32,
    pub export_timestamp: u64,
    pub export_version: String,
    pub platform_statistics: Vec<(String, String)>,
}

pub fn require_auth(_env: &Env, address: &Address) -> Result<(), Error> {
    address.require_auth();
    Ok(())
}
