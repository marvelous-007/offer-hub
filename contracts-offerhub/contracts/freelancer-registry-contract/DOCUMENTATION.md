# Freelancer Registry Contract Documentation

## Overview

The Freelancer Registry Contract is a Soroban smart contract designed to manage freelancer profiles, skills, job history, and ratings on the Stellar blockchain. It provides a decentralized platform for freelancers to showcase their expertise and for clients to find qualified professionals based on skills and ratings.

## Contract Features

### Freelancer Management
- Register new freelancers with skills and hourly rates
- Update freelancer skills and hourly rates
- Remove freelancers from the registry
- Search for freelancers by specific skills

### Job Management
- Record completed jobs with payment information
- Track freelancer earnings and job history
- Associate jobs with both freelancers and clients

### Rating System
- Allow clients to rate freelancers (1-5 stars)
- Include comments with ratings
- Calculate average ratings for freelancers

## Data Structures

### Freelancer
```rust
pub struct Freelancer {
    pub address: Address,
    pub skills: Vec<Symbol>,
    pub hourly_rate: u64,
    pub total_earnings: u64,
    pub jobs_completed: u64,
    pub registered_at: u64,
    pub last_updated: u64,
}
```

### Job
```rust
pub struct Job {
    pub freelancer: Address,
    pub client: Address,
    pub description: String,
    pub payment: u64,
    pub timestamp: u64,
}
```

### Rating
```rust
pub struct Rating {
    pub freelancer: Address,
    pub client: Address,
    pub rating: u32,  // Rating from 1-5
    pub comment: String,
    pub timestamp: u64,
}
```

## Contract Functions

### Freelancer Registration and Management
- `register_freelancer(env: Env, freelancer: Address, skills: Vec<Symbol>, hourly_rate: u64)`
- `update_skills(env: Env, freelancer: Address, new_skills: Vec<Symbol>)`
- `update_hourly_rate(env: Env, freelancer: Address, new_rate: u64)`
- `is_registered(env: Env, freelancer: Address) -> bool`
- `get_freelancer(env: Env, freelancer: Address) -> Freelancer`
- `remove_freelancer(env: Env, freelancer: Address)`
- `get_all_freelancers(env: Env) -> Vec<Address>`
- `get_recent_freelancers(env: Env, cutoff_time: u64) -> Vec<Freelancer>`
- `get_freelancer_count(env: Env) -> u64`

### Skill Management
- `add_skill(env: Env, freelancer: Address, skill: Symbol)`
- `remove_skill(env: Env, freelancer: Address, skill: Symbol)`
- `search_by_skill(env: Env, skill: Symbol) -> Vec<Freelancer>`

### Job Management
- `add_job(env: Env, freelancer: Address, client: Address, job_description: String, payment: u64)`
- `get_all_jobs(env: Env, freelancer: Address) -> Vec<Job>`

### Rating System
- `rate_freelancer(env: Env, freelancer: Address, client: Address, rating: u32, comment: String)`
- `get_average_rating(env: Env, freelancer: Address) -> u32`
- `get_all_ratings(env: Env, freelancer: Address) -> Vec<Rating>`

## Authorization Requirements

- Freelancers must authorize registration and profile updates
- Clients must authorize job additions and ratings
- Only the freelancer can update their own profile

## Usage Examples

### Registering a Freelancer
```rust
// Create a client for the contract
let client = ContractClient::new(env, &contract_id);

// Register a new freelancer with skills and hourly rate
let skills = vec![&env, Symbol::new(&env, "rust"), Symbol::new(&env, "blockchain")];
client.register_freelancer(&freelancer_address, &skills, &100);
```

### Adding a Job
```rust
// Add a completed job
let job_description = String::from_str(&env, "Developed smart contract");
client.add_job(&freelancer_address, &client_address, &job_description, &500);
```

### Rating a Freelancer
```rust
// Rate a freelancer
let comment = String::from_str(&env, "Excellent work!");
client.rate_freelancer(&freelancer_address, &client_address, &5, &comment);
```

### Searching for Freelancers by Skill
```rust
// Find freelancers with specific skills
let blockchain_skill = Symbol::new(&env, "blockchain");
let matching_freelancers = client.search_by_skill(&blockchain_skill);
```

## Events

The contract emits events for key actions:
- Freelancer registration: `fr_reg`
- Skills updates: `skills`
- Hourly rate updates: `rate`
- Job additions: `job_add`
- Ratings: `rating`
- Freelancer removal: `fr_rem`

## Security Considerations

- All profile modifications require authorization from the freelancer
- All job additions and ratings require authorization from the client
- Rating values are validated to be between 1 and 5
- Duplicate registrations are prevented
