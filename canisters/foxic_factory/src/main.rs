pub mod actor;
pub mod factory;
pub mod state;
pub mod types;

#[allow(dead_code)]
#[cfg(any(target_arch = "wasm32", test))]
fn main() {}

#[allow(dead_code)]
#[cfg(not(any(target_arch = "wasm32", test)))]
fn main() {
    use crate::factory::FoxICFactory;
    use crate::types::*;
    use ic_cdk::export::Principal;

    candid::export_service!();
    std::print!("{}", __export_service());
}
