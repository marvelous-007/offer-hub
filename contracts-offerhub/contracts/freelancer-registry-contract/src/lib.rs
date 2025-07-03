#![no_std]

use soroban_sdk::{contract, contractimpl, vec, Address, Env, String, Symbol, Vec};
use soroban_sdk::symbol_short;

mod register;
mod storage;
mod skills;
mod jobs;
mod ratings;

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    /// Register a new freelancer and emit event
    pub fn register_freelancer(env: Env, freelancer: Address, skills: Vec<Symbol>, hourly_rate: u64) {
        register::register_freelancer(env.clone(), freelancer.clone(), skills.clone(), hourly_rate);

        env.events().publish(
            (symbol_short!("fr_reg"), freelancer.clone()),
            (skills, hourly_rate),
        );
    }

    /// Update freelancer's skills and emit event
    pub fn update_skills(env: Env, freelancer: Address, new_skills: Vec<Symbol>) {
        skills::update_skills(env.clone(), freelancer.clone(), new_skills.clone());

        env.events().publish(
            (symbol_short!("skills"), freelancer.clone()),
            new_skills,
        );
    }

    /// Update freelancer's hourly rate and emit event
    pub fn update_hourly_rate(env: Env, freelancer: Address, new_rate: u64) {
        register::update_hourly_rate(env.clone(), freelancer.clone(), new_rate);

        env.events().publish(
            (symbol_short!("rate"), freelancer.clone()),
            new_rate,
        );
    }

    /// Check if a freelancer is already registered
    pub fn is_registered(env: Env, freelancer: Address) -> bool {
        register::is_registered(env, freelancer)
    }

    /// Get full freelancer profile
    pub fn get_freelancer(env: Env, freelancer: Address) -> storage::Freelancer {
        storage::FreelancerStorage::get_full_profile(&env, &freelancer)
    }

    /// Add a job to freelancer's history and emit event
    pub fn add_job(env: Env, freelancer: Address, client: Address, job_description: String, payment: u64) {
        jobs::add_job(env.clone(), freelancer.clone(), client.clone(), job_description.clone(), payment);

        env.events().publish(
            (symbol_short!("job_add"), freelancer.clone()),
            (client, job_description, payment),
        );
    }

    /// Rate a freelancer and emit event
    pub fn rate_freelancer(env: Env, freelancer: Address, client: Address, rating: u32, comment: String) {
        ratings::add_rating(env.clone(), freelancer.clone(), client.clone(), rating, comment.clone());

        env.events().publish(
            (symbol_short!("rating"), freelancer.clone()),
            (client, rating, comment),
        );
    }

    /// Get freelancer's average rating
    pub fn get_average_rating(env: Env, freelancer: Address) -> u32 {
        ratings::get_average_rating(env, freelancer)
    }

    /// Get all ratings for a freelancer
    pub fn get_all_ratings(env: Env, freelancer: Address) -> Vec<storage::Rating> {
        ratings::get_all_ratings(env, freelancer)
    }

    /// Get all jobs for a freelancer
    pub fn get_all_jobs(env: Env, freelancer: Address) -> Vec<storage::Job> {
        jobs::get_all_jobs(env, freelancer)
    }

    /// Remove a freelancer and emit event
    pub fn remove_freelancer(env: Env, freelancer: Address) {
        storage::FreelancerStorage::remove(&env, &freelancer);

        env.events().publish(
            (symbol_short!("fr_rem"), freelancer),
            (),
        );
    }

    /// Get all registered freelancers
    pub fn get_all_freelancers(env: Env) -> Vec<Address> {
        storage::FreelancerStorage::get_all_freelancers(&env)
    }

    /// Get recent freelancers within a specific time window
    pub fn get_recent_freelancers(env: Env, cutoff_time: u64) -> Vec<storage::Freelancer> {
        storage::FreelancerStorage::get_recent_freelancers(&env, cutoff_time)
    }

    /// Get the number of registered freelancers
    pub fn get_freelancer_count(env: Env) -> u64 {
        storage::FreelancerStorage::get_freelancer_count(&env)
    }

    /// Add skill to a freelancer's profile and emit event
    pub fn add_skill(env: Env, freelancer: Address, skill: Symbol) {
        skills::add_skill(env.clone(), freelancer.clone(), skill.clone());

        env.events().publish(
            (symbol_short!("skill_add"), freelancer),
            skill,
        );
    }

    /// Remove skill from a freelancer's profile and emit event
    pub fn remove_skill(env: Env, freelancer: Address, skill: Symbol) {
        skills::remove_skill(env.clone(), freelancer.clone(), skill.clone());

        env.events().publish(
            (symbol_short!("skill_rem"), freelancer),
            skill,
        );
    }

    /// Search freelancers by skill
    pub fn search_by_skill(env: Env, skill: Symbol) -> Vec<storage::Freelancer> {
        skills::search_by_skill(env, skill)
    }
}

mod test;
