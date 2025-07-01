use soroban_sdk::{Address, Env, Symbol, i32, symbol_short};

/// Event topics for the Rating Contract
pub(crate) const RATING_SUBMITTED: Symbol = symbol_short!("RATING_SUBMITTED");

/// Emit an event when a rating is submitted
pub fn emit_rating_submitted(env: &Env, rater: &Address, target: &Address, job_id: u32, score: i32) {
    let topics = (RATING_SUBMITTED, rater.clone(), target.clone(), job_id);
    env.events().publish(topics, score);
}
