# Token Reward Contract

A Soroban smart contract for Stellar that provides an incentive system using custom tokens or badges. Rewards are distributed based on specific user actions, such as completing jobs, receiving high ratings, or consistent participation.

## Features

- **Claim Rewards**: Users can claim rewards based on specific events
- **Duplicate Prevention**: Prevents users from claiming the same reward twice
- **Event Tracking**: Tracks all claimed rewards with timestamps
- **Admin Management**: Contract initialization with admin authentication
- **Modular Design**: Clean separation of concerns across multiple modules

## Contract Structure

The contract is organized into the following modules:

- `lib.rs` - Main contract interface and public API
- `types.rs` - Type definitions, error handling, and constants
- `storage.rs` - Storage management and data persistence
- `reward.rs` - Core reward logic and business rules
- `events.rs` - Event emission for reward claims
- `test.rs` - Comprehensive unit tests

## API Reference

### Initialize Contract
```rust
pub fn init(env: Env, admin: Address) -> Result<(), Error>
```
Initializes the contract with an admin address. Must be called once before using other functions.

### Claim Reward
```rust
pub fn claim_reward(env: Env, user: Address, event_key: String) -> Result<(), Error>
```
Allows a user to claim a reward based on a specific event key. Prevents duplicate claims.

**Example event keys:**
- `"job_completed"`
- `"5_star_rating"`
- `"consistent_participation"`
- `"first_project"`
- `"milestone_reached"`

### Get User Rewards
```rust
pub fn get_rewards(env: Env, address: Address) -> Vec<RewardData>
```
Retrieves all rewards claimed by the given address.

### Check Claim Status
```rust
pub fn has_claimed(env: Env, address: Address, event_key: String) -> bool
```
Returns whether a reward has already been claimed for a specific event.

### Get Admin
```rust
pub fn get_admin(env: Env) -> Result<Address, Error>
```
Returns the admin address (useful for verification).

## Data Types

### RewardData
```rust
pub struct RewardData {
    pub event_key: String,    // Event identifier
    pub timestamp: u64,       // When the reward was claimed
}
```

### Error Types
```rust
pub enum Error {
    Unauthorized = 1,           // User lacks required permissions
    RewardAlreadyClaimed = 2,   // Reward already claimed for this event
    InvalidEvent = 3,           // Invalid event key provided
    NotInitialized = 4,         // Contract not yet initialized
}
```

## Events

The contract emits the following events:

- **Reward Claimed**: `("reward", "claimed")` with data `(user, event_key, timestamp)`
- **Contract Initialized**: `("contract", "init")` with data `(admin)`

## Usage Example

```rust
// Initialize contract
let admin = Address::generate(&env);
contract.init(admin)?;

// User claims a reward
let user = Address::generate(&env);
let event_key = String::from_str(&env, "job_completed");
contract.claim_reward(user.clone(), event_key.clone())?;

// Check if reward was claimed
let claimed = contract.has_claimed(user.clone(), event_key);
assert!(claimed);

// Get all user rewards
let rewards = contract.get_rewards(user);
assert_eq!(rewards.len(), 1);
```

## Testing

Run the comprehensive test suite:

```bash
cd contracts-offerhub/contracts/toker-reward-contract/src
cargo test
```

### Test Coverage

- ✅ Contract initialization
- ✅ Successful reward claiming
- ✅ Duplicate claim prevention
- ✅ Invalid event handling
- ✅ Multiple rewards per user
- ✅ Empty rewards list
- ✅ Claim status checking
- ✅ Multiple users with same events

## Security Features

1. **Authentication**: All functions require proper caller authentication
2. **Duplicate Prevention**: Events can only be claimed once per user
3. **Input Validation**: Event keys are validated before processing
4. **Admin Control**: Contract initialization requires admin authentication
5. **Error Handling**: Comprehensive error types for all failure scenarios


## Future Enhancements

- Token minting integration for reward distribution
- Admin-controlled event validation rules
- Reward value/points system
- Time-based reward expiration
- Batch reward claiming
- Integration with external Oracle for event verification

## License

This contract is part of the OfferHub project and follows the project's licensing terms.
