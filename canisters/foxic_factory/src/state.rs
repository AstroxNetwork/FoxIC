use crate::factory::FoxICFactory;
use crate::types::StableStorage;
use candid::Reserved;
use ic_cdk::{caller, storage};
use ic_cdk_macros::*;
use ic_types::Principal;
use itertools::Itertools;
use std::cell::RefCell;
use std::mem;
use std::ops::Deref;
use std::thread::LocalKey;

thread_local! {
    pub static CONF: RefCell<FoxICFactory> = RefCell::new(FoxICFactory::new());
    pub static MANAGER_LIST: RefCell<Vec<Principal>> = RefCell::new(Default::default());
}

pub fn owner_guard() -> Result<(), String> {
    if MANAGER_LIST.with(|o| o.borrow().iter().contains(&caller())) {
        Ok(())
    } else {
        Err(String::from("The caller is not the manager of contract"))
    }
}

impl Default for StableStorage {
    fn default() -> Self {
        Self {
            factory: FoxICFactory::new(),
            manager_list: vec![],
        }
    }
}

const STABLE_VERSION: u32 = 2;

#[pre_upgrade]
fn pre_upgrade() {
    let stable = StableStorage {
        factory: CONF.with(|c| c.borrow().clone()),
        manager_list: MANAGER_LIST.with(|c| c.borrow().clone()),
    };
    match storage::stable_save((stable, Some(STABLE_VERSION))) {
        Ok(_) => (),
        Err(candid_err) => {
            ic_cdk::trap(&format!(
                "An error occurred when saving to stable memory (pre_upgrade)"
            ));
        }
    };
}

#[post_upgrade]
fn post_upgrade() {
    let StableStorage {
        factory,
        manager_list,
    } = if let Ok((storage, Some(STABLE_VERSION))) =
        storage::stable_restore::<(StableStorage, Option<u32>)>()
    {
        storage
    } else {
        return;
    };
    CONF.with(|factory0| *factory0.borrow_mut() = factory);
    MANAGER_LIST.with(|owner0| *owner0.borrow_mut() = manager_list);
}
