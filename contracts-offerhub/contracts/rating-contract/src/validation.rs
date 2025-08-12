use crate::storage::{has_rated_contract, get_user_rating_stats, get_user_restriction};
use crate::types::{Error, MIN_RATING, MAX_RATING, MAX_FEEDBACK_LENGTH};
use soroban_sdk::{Address, Env, String};

pub fn validate_rating(rating: u8) -> Result<(), Error> {
    if rating < MIN_RATING || rating > MAX_RATING {
        return Err(Error::InvalidRating);
    }
    Ok(())
}

pub fn validate_feedback(feedback: &String) -> Result<(), Error> {
    if feedback.len() > MAX_FEEDBACK_LENGTH {
        return Err(Error::InvalidRating); // Using generic error for now
    }
    Ok(())
}

pub fn validate_rating_eligibility(
    env: &Env,
    rater: &Address,
    rated_user: &Address,
    contract_id: &String,
) -> Result<(), Error> {
    // Check if rater has already rated this contract
    if has_rated_contract(env, rater, contract_id) {
        return Err(Error::AlreadyRated);
    }
    
    // Check if rater is trying to rate themselves
    if *rater == *rated_user {
        return Err(Error::InvalidRating);
    }
    
    // Check if rater has restrictions
    let restriction = get_user_restriction(env, rater);
    if restriction.to_string() == "restricted" {
        return Err(Error::RatingRestricted);
    }
    
    Ok(())
}

pub fn validate_moderation_action(action: &String) -> Result<(), Error> {
    let valid_actions = ["approve", "remove", "flag"];
    if !valid_actions.contains(&action.to_string().as_str()) {
        return Err(Error::InvalidModerationAction);
    }
    Ok(())
}

pub fn check_spam_prevention(env: &Env, rater: &Address) -> Result<(), Error> {
    // Check if user is making too many ratings in a short time
    // This would need timestamp-based logic in production
    // For now, just check basic restrictions
    let restriction = get_user_restriction(env, rater);
    if restriction.to_string() == "spam_restricted" {
        return Err(Error::RatingRestricted);
    }
    Ok(())
}

pub fn validate_incentive_eligibility(
    env: &Env,
    user: &Address,
    incentive_type: &String,
) -> Result<(), Error> {
    let stats = get_user_rating_stats(env, user);
    
    match incentive_type.to_string().as_str() {
        "first_five_star" => {
            if let Ok(s) = stats {
                if s.five_star_count == 0 {
                    return Err(Error::IncentiveNotFound);
                }
            } else {
                return Err(Error::InsufficientRatings);
            }
        }
        "ten_reviews" => {
            if let Ok(s) = stats {
                if s.total_ratings < 10 {
                    return Err(Error::IncentiveNotFound);
                }
            } else {
                return Err(Error::InsufficientRatings);
            }
        }
        "top_rated" => {
            if let Ok(s) = stats {
                if s.average_rating < 480 || s.total_ratings < 20 {
                    return Err(Error::IncentiveNotFound);
                }
            } else {
                return Err(Error::InsufficientRatings);
            }
        }
        _ => return Err(Error::IncentiveNotFound),
    }
    
    Ok(())
}
