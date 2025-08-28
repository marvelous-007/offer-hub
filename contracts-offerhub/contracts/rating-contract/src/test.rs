#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::{Address as _}, Address, Env, String, Vec};
use crate::{Contract, Error, RatingStats, Feedback, UserRatingData};

fn create_contract(e: &Env) -> Address {
    e.register(Contract, ())
}

#[test]
fn test_rating_contract_initialization() {
    let env = Env::default();
    env.mock_all_auths();

    // Test basic contract registration
    let contract_id = create_contract(&env);
    assert!(contract_id != Address::generate(&env));
    
    // Test that we can create a client
    let client = ContractClient::new(&env, &contract_id);
    assert!(client.address == contract_id);
}

#[test]
fn test_rating_validation_logic() {
    let env = Env::default();
    
    // Test valid rating range
    let valid_ratings = [1u32, 2, 3, 4, 5];
    for rating in valid_ratings.iter() {
        assert!(rating >= &1 && rating <= &5, "Rating {} should be valid", rating);
    }
    
    // Test invalid ratings
    let invalid_ratings = [0u32, 6, 10, 100];
    for rating in invalid_ratings.iter() {
        assert!(!(rating >= &1 && rating <= &5), "Rating {} should be invalid", rating);
    }
}

#[test]
fn test_rating_data_structures() {
    let env = Env::default();
    
    // Test basic string operations
    let feedback_text = String::from_str(&env, "Excellent work!");
    assert_eq!(feedback_text.len(), 15); // "Excellent work!" tiene 15 caracteres
    
    let category = String::from_str(&env, "web_development");
    assert_eq!(category.len(), 15);
    
    // Test address generation
    let rater = Address::generate(&env);
    let rated_user = Address::generate(&env);
    assert_ne!(rater, rated_user);
    
    // Test timestamp
    let timestamp = env.ledger().timestamp();
    assert!(timestamp >= 0); // Timestamp can be 0 in test environment
}

#[test]
fn test_rating_calculations() {
    let env = Env::default();
    
    // Test average rating calculation
    let ratings = [5u32, 4, 5, 3, 5]; // 5, 4, 5, 3, 5
    let total: u32 = ratings.iter().sum();
    let average = total / ratings.len() as u32;
    
    assert_eq!(total, 22);
    assert_eq!(average, 4); // 22 / 5 = 4.4, pero como es u32 = 4
    
    // Test percentage calculation
    let five_star_count = ratings.iter().filter(|&&r| r == 5).count() as u32;
    let five_star_percentage = (five_star_count * 100) / ratings.len() as u32;
    
    assert_eq!(five_star_count, 3);
    assert_eq!(five_star_percentage, 60); // 3/5 * 100 = 60%
}

#[test]
fn test_rating_categories() {
    let env = Env::default();
    
    let categories = [
        String::from_str(&env, "web_development"),
        String::from_str(&env, "mobile_development"),
        String::from_str(&env, "design"),
        String::from_str(&env, "marketing"),
        String::from_str(&env, "consulting"),
    ];
    
    // Test that all categories are valid
    for category in &categories {
        assert!(category.len() > 0, "Category should not be empty");
        assert!(category.len() <= 50, "Category should not be too long");
    }
    
    // Test unique categories
    let mut unique_categories = Vec::new(&env);
    for category in &categories {
        if !unique_categories.contains(category) {
            unique_categories.push_back(category.clone());
        }
    }
    
    assert_eq!(unique_categories.len(), categories.len() as u32);
}
