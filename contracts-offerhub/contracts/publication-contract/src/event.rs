use soroban_sdk::{Address, Env, Symbol};

pub fn publication_created(e: &Env, user: Address, id: u32, pub_type: Symbol) {
    let topics = (Symbol::new(e, "publication_created"), user, pub_type);
    e.events().publish(topics, id);
}
