use crate::types::{FoxICWallet, StableStorage};

use ic_cdk::{caller, storage};
use ic_cdk_macros::*;
use ic_types::Principal;
use std::cell::RefCell;
use std::ops::Deref;

thread_local! {
    pub static CONF: RefCell<FoxICWallet> = RefCell::new(FoxICWallet::new());
    pub static CANISTER_OWNER: RefCell<Principal> = RefCell::new(Principal::anonymous());
}

pub fn owner_guard() -> Result<(), String> {
    if CANISTER_OWNER.with(|o| o.borrow().deref().to_text() == caller().to_text()) {
        Ok(())
    } else {
        Err(String::from("The caller is not the manager of contract"))
    }
}

impl Default for StableStorage {
    fn default() -> Self {
        Self {
            wallet: FoxICWallet::new(),
            owner: Principal::anonymous(),
        }
    }
}

const STABLE_VERSION: u32 = 2;

#[pre_upgrade]
fn pre_upgrade() {
    let stable = StableStorage {
        wallet: CONF.with(|c| c.borrow().clone()),
        owner: CANISTER_OWNER.with(|c| c.borrow().clone()),
    };
    match storage::stable_save((stable, Some(STABLE_VERSION))) {
        Ok(_) => (),
        Err(_) => {
            ic_cdk::trap(&format!(
                "An error occurred when saving to stable memory (pre_upgrade)"
            ));
        }
    };
}

#[post_upgrade]
fn post_upgrade() {
    let StableStorage { wallet, owner } = if let Ok((storage, Some(STABLE_VERSION))) =
        storage::stable_restore::<(StableStorage, Option<u32>)>()
    {
        storage
    } else {
        return;
    };
    CONF.with(|wallet0| *wallet0.borrow_mut() = wallet);
    CANISTER_OWNER.with(|owner0| *owner0.borrow_mut() = owner);
}
