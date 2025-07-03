# Test Documentation for Freelancer Registry Contract

## Overview

This document outlines the testing approach for the Freelancer Registry Contract. The test suite is designed to verify the correctness, security, and reliability of the contract's functionality.

## Test Environment

Tests are executed in a simulated Soroban environment using the `soroban_sdk::testutils` module, which provides:

- Mock ledger functionality
- Address generation
- Authorization mocking
- Timestamp manipulation

## Test Categories

### 1. Freelancer Registration Tests

- **test_register_freelancer_success**: Verifies that a freelancer can be successfully registered with skills and hourly rate
- **test_register_duplicate_freelancer_fails**: Ensures that attempting to register the same freelancer twice results in an error

### 2. Skills Management Tests

- **test_update_skills_success**: Verifies that a freelancer's skills can be updated
- **test_add_skill_success**: Tests adding a single skill to a freelancer's profile
- **test_remove_skill_success**: Tests removing a skill from a freelancer's profile

### 3. Hourly Rate Tests

- **test_update_hourly_rate_success**: Verifies that a freelancer's hourly rate can be updated

### 4. Job Management Tests

- **test_add_job_success**: Tests adding a job to a freelancer's history and verifies earnings are updated

### 5. Rating Tests

- **test_rate_freelancer_success**: Verifies that clients can rate freelancers and average ratings are calculated correctly
- **test_invalid_rating_fails**: Ensures that ratings outside the valid range (1-5) are rejected

### 6. Search Tests

- **test_search_by_skill**: Tests the functionality to search for freelancers by specific skills

### 7. Freelancer Management Tests

- **test_remove_freelancer**: Verifies that freelancers can be removed from the registry
- **test_get_freelancer_count**: Tests the function that returns the total number of registered freelancers
- **test_get_all_freelancers**: Verifies that all registered freelancers can be retrieved

## Test Utilities

### Helper Functions

- **create_env()**: Creates a default Soroban environment for testing
- **register_contract(env)**: Registers the contract in the test environment
- **setup_ledger_time(env, timestamp)**: Sets up the ledger with a specific timestamp
- **create_client(env, contract_id)**: Creates a contract client for interacting with the contract
- **create_skills_vec(env, skills)**: Creates a vector of skill symbols for testing

## Test Data

Tests use randomly generated addresses for freelancers and clients:
```rust
let freelancer = Address::generate(&env);
let client_address = Address::generate(&env);
```

Common test data includes:
- Skills vectors with various combinations of skills
- Hourly rates (typically 100-150 units)
- Job payments (typically 500 units)
- Ratings (1-5 scale)

## Authorization Testing

All functions that require authorization are tested with mock authorizations:
```rust
env.mock_all_auths();
```

This simulates the proper authorization of transactions by the relevant parties (freelancers and clients).

## Error Handling Tests

Tests verify that the contract correctly handles error conditions:
- Duplicate registrations
- Invalid ratings
- Operations on non-existent freelancers

These tests use the `#[should_panic]` attribute to verify that the expected errors are thrown.

## Running the Tests

Tests can be run using the standard Cargo test command:
```bash
cargo test
```

Or using the provided Makefile:
```bash
make test
```

## Test Coverage

The test suite aims to cover:
- All public contract functions
- All error conditions
- Edge cases (e.g., empty skill sets, boundary values for ratings)
- Authorization requirements

## Future Test Enhancements

- Property-based testing for more exhaustive coverage
- Stress testing with large numbers of freelancers and jobs
- Integration tests with other contracts
- Formal verification of critical contract properties
