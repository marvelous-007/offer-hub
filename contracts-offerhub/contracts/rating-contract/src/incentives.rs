use crate::storage::{get_incentive_record, save_incentive_record, get_user_rating_stats, get_reputation_contract};
use crate::types::{Error, IncentiveRecord};
use crate::events::{emit_incentive_claimed, emit_achievement_earned};
use crate::validation::validate_incentive_eligibility;
use soroban_sdk::{Address, Env, String, Vec, symbol_short};

pub fn check_rating_incentives(env: &Env, user: &Address) -> Vec<String> {
    let mut available_incentives = Vec::new(env);
    
    if let Ok(stats) = get_user_rating_stats(env, user) {
        // First five-star rating incentive
        if stats.five_star_count >= 1 && !is_incentive_claimed(env, user, &String::from_str(env, "first_five_star")) {
            available_incentives.push_back(String::from_str(env, "first_five_star"));
        }
        
        // Ten ratings milestone
        if stats.total_ratings >= 10 && !is_incentive_claimed(env, user, &String::from_str(env, "ten_reviews")) {
            available_incentives.push_back(String::from_str(env, "ten_reviews"));
        }
        
        // Fifty ratings milestone
        if stats.total_ratings >= 50 && !is_incentive_claimed(env, user, &String::from_str(env, "fifty_reviews")) {
            available_incentives.push_back(String::from_str(env, "fifty_reviews"));
        }
        
        // Perfect month (all 5-star ratings in last 30 days)
        if check_perfect_month(env, user) && !is_incentive_claimed(env, user, &String::from_str(env, "perfect_month")) {
            available_incentives.push_back(String::from_str(env, "perfect_month"));
        }
        
        // Top rated achievement
        if stats.average_rating >= 480 && stats.total_ratings >= 20 && !is_incentive_claimed(env, user, &String::from_str(env, "top_rated")) {
            available_incentives.push_back(String::from_str(env, "top_rated"));
        }
        
        // Consistency award (maintaining high rating over time)
        if check_consistency_award(env, user) && !is_incentive_claimed(env, user, &String::from_str(env, "consistency_award")) {
            available_incentives.push_back(String::from_str(env, "consistency_award"));
        }
        
        // Improvement award (significant rating improvement)
        if check_improvement_award(env, user) && !is_incentive_claimed(env, user, &String::from_str(env, "improvement_award")) {
            available_incentives.push_back(String::from_str(env, "improvement_award"));
        }
    }
    
    available_incentives
}

pub fn claim_incentive_reward(
    env: &Env,
    caller: &Address,
    incentive_type: &String,
) -> Result<(), Error> {
    caller.require_auth();
    
    // Validate eligibility
    validate_incentive_eligibility(env, caller, incentive_type)?;
    
    // Check if already claimed
    if is_incentive_claimed(env, caller, incentive_type) {
        return Err(Error::IncentiveAlreadyClaimed);
    }
    
    // Mark as claimed
    let record = IncentiveRecord {
        user: caller.clone(),
        incentive_type: incentive_type.clone(),
        claimed: true,
        timestamp: env.ledger().timestamp(),
    };
    save_incentive_record(env, &record);
    
    // Award the specific incentive
    let reward = award_incentive(env, caller, incentive_type)?;
    
    emit_incentive_claimed(env, caller, incentive_type, &reward);
    
    Ok(())
}

fn award_incentive(env: &Env, user: &Address, incentive_type: &String) -> Result<String, Error> {
    match incentive_type.to_string().as_str() {
        "first_five_star" => {
            // Award a small reputation boost or token reward
            award_reputation_nft(env, user, &symbol_short!("5starfst"))?;
            Ok(String::from_str(env, "First Five Star NFT"))
        }
        "ten_reviews" => {
            // Award reputation NFT for 10 completed reviews
            award_reputation_nft(env, user, &symbol_short!("tenrev"))?;
            Ok(String::from_str(env, "Ten Reviews Achievement NFT"))
        }
        "fifty_reviews" => {
            // Award reputation NFT for 50 completed reviews
            award_reputation_nft(env, user, &symbol_short!("fiftyrev"))?;
            Ok(String::from_str(env, "Fifty Reviews Milestone NFT"))
        }
        "perfect_month" => {
            // Award special NFT for perfect month
            award_reputation_nft(env, user, &symbol_short!("perfmth"))?;
            Ok(String::from_str(env, "Perfect Month NFT"))
        }
        "top_rated" => {
            // Award top-rated professional NFT
            award_reputation_nft(env, user, &symbol_short!("toprated"))?;
            Ok(String::from_str(env, "Top Rated Professional NFT"))
        }
        "consistency_award" => {
            // Award consistency NFT
            award_reputation_nft(env, user, &symbol_short!("consist"))?;
            Ok(String::from_str(env, "Consistency Award NFT"))
        }
        "improvement_award" => {
            // Award improvement NFT
            award_reputation_nft(env, user, &symbol_short!("improve"))?;
            Ok(String::from_str(env, "Most Improved NFT"))
        }
        _ => Err(Error::IncentiveNotFound),
    }
}

fn award_reputation_nft(env: &Env, user: &Address, nft_type: &soroban_sdk::Symbol) -> Result<(), Error> {
    let reputation_contract = get_reputation_contract(env)?;
    
    // Call the reputation contract to mint achievement NFT
    // This would use cross-contract calls in production
    let nft_type_str = String::from_str(env, "achievement");
    emit_achievement_earned(env, user, &nft_type_str, 1);
    
    Ok(())
}

fn is_incentive_claimed(env: &Env, user: &Address, incentive_type: &String) -> bool {
    if let Ok(record) = get_incentive_record(env, user, incentive_type) {
        record.claimed
    } else {
        false
    }
}

fn check_perfect_month(env: &Env, _user: &Address) -> bool {
    // In production, this would check if all ratings in the last 30 days were 5 stars
    // For now, return false (this would need timestamp-based rating queries)
    false
}

fn check_consistency_award(env: &Env, user: &Address) -> bool {
    // In production, this would check if user maintained high rating over extended period
    if let Ok(stats) = get_user_rating_stats(env, user) {
        stats.average_rating >= 450 && stats.total_ratings >= 30
    } else {
        false
    }
}

fn check_improvement_award(env: &Env, _user: &Address) -> bool {
    // In production, this would compare recent ratings vs historical ratings
    // For now, return false (this would need historical data analysis)
    false
}

pub fn calculate_incentive_value(incentive_type: &String) -> u32 {
    // Return incentive value in platform tokens or reputation points
    match incentive_type.to_string().as_str() {
        "first_five_star" => 100,
        "ten_reviews" => 250,
        "fifty_reviews" => 500,
        "perfect_month" => 1000,
        "top_rated" => 2000,
        "consistency_award" => 1500,
        "improvement_award" => 800,
        _ => 0,
    }
}

pub fn get_seasonal_incentives(env: &Env) -> Vec<String> {
    // Return current seasonal or limited-time incentives
    let mut seasonal = Vec::new(env);
    
    // This would be based on current date/season in production
    seasonal.push_back(String::from_str(env, "winter_excellence"));
    seasonal.push_back(String::from_str(env, "new_year_boost"));
    
    seasonal
}
