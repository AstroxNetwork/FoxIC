use crate::factory::FoxICFactory;
use crate::state::{owner_guard, CONF, MANAGER_LIST};
use crate::types::{Canister, WalletInstallRequest, WalletInstallResponse};
use candid::candid_method;
use ic_cdk::caller;
use ic_cdk_macros::*;
use ic_types::Principal;
use itertools::Itertools;
use std::borrow::BorrowMut;
use std::ops::Deref;

#[init]
#[candid_method(init)]
fn init() {
    MANAGER_LIST.with(|o| o.borrow_mut().push(caller()));
}

#[query(name = "greeting")]
#[candid_method(query, rename = "greeting")]
pub fn greeting(greet: String) -> String {
    format!("hello back from rust: {}", greet.as_str()).to_string()
}

#[update(name = "set_conf", guard = "owner_guard")]
#[candid_method(update, rename = "set_conf")]
pub fn set_conf(conf: FoxICFactory) {
    CONF.with(|c| c.replace(conf));
}

#[update(name = "add_owner", guard = "owner_guard")]
#[candid_method(update, rename = "add_owner")]
pub fn add_owner(owner: Principal) {
    MANAGER_LIST.with(|o| o.borrow_mut().push(owner.clone()))
}

#[query(name = "is_owner")]
#[candid_method(query, rename = "is_owner")]
pub fn is_owner() -> bool {
    MANAGER_LIST.with(|o| o.borrow().iter().contains(&caller()))
}

#[query(name = "get_wallet")]
#[candid_method(query, rename = "get_wallet")]
pub fn get_wallet() -> Option<Canister> {
    CONF.with(|c| c.borrow().get_wallet(caller()))
}

/// async function getting balance
#[update(name = "factory_wallet_upload", guard = "owner_guard")]
#[candid_method(update, rename = "factory_wallet_upload")]
pub fn factory_wallet_upload(bytes: Vec<u8>) {
    CONF.with(|f| {
        let mut f = f.borrow_mut();
        f.upload_wallet_wasm(bytes)
    });
}

/// async function getting balance
#[update(name = "factory_wallet_install")]
#[candid_method(update, rename = "factory_wallet_install")]
pub async fn factory_wallet_install() -> Result<WalletInstallResponse, String> {
    let mut factory = CONF.with(|f| f.borrow_mut().deref().clone());
    let result = factory
        .install_foxic_wallet(WalletInstallRequest {
            controller: caller(),
            cycles: None,
        })
        .await;
    CONF.with(|f| f.replace(factory));
    result
}
