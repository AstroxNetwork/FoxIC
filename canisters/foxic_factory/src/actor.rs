use crate::state::{owner_guard, CANISTER_OWNER, CONF};
use crate::types::{WalletInstallRequest, WalletInstallResponse};
use candid::candid_method;
use ic_cdk::caller;
use ic_cdk_macros::*;
use std::ops::Deref;

#[init]
#[candid_method(init)]
fn init() {
    CANISTER_OWNER.with(|o| o.replace(caller()));
}

#[query(name = "greeting")]
#[candid_method(query, rename = "greeting")]
pub fn greeting(greet: String) -> String {
    format!("hello back from rust: {}", greet.as_str()).to_string()
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
