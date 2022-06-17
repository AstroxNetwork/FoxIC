mod actor;
mod eth;
mod http;
mod state;
pub mod types;
mod wallet;

#[allow(dead_code)]
#[cfg(any(target_arch = "wasm32", test))]
fn main() {}

#[allow(dead_code)]
#[cfg(not(any(target_arch = "wasm32", test)))]
fn main() {
    use crate::types::*;
    use ic_cdk::api::call::*;
    use ic_cdk::export::Principal;
    use ic_ledger_types::{AccountBalanceArgs, BlockIndex, Subaccount, Tokens};
    candid::export_service!();
    std::print!("{}", __export_service());
}
