use candid::candid_method;
use ic_cdk_macros::*;


#[init]
fn init() {}

#[query(name = "greeting")]
#[candid_method(query, rename = "greeting")]
pub fn greeting(greet: String) -> String {
    format!("hello back from rust: {}", greet.as_str()).to_string()
}
