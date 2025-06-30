use soroban_sdk::{Address, Env, Symbol};

pub fn emit_job_post_open(e: &Env, owner: &Address, job_id: &u32, budget: u64, time: u64) {
    e.events().publish(
        (Symbol::new(e, "OPEN"), Symbol::new(e, "JOBPOST")),
        (owner, job_id.clone(), budget, time),
    );
}

pub fn emit_job_post_closed(e: &Env, owner: &Address, job_id: &u32) {
    e.events().publish(
        (Symbol::new(e, "CLOSED"), Symbol::new(e, "JOBPOST")),
        (owner, job_id.clone(), e.ledger().timestamp()),
    );
}
