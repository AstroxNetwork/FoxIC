use crate::factory::FoxICFactory;
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, Eq, PartialEq)]
pub enum CanisterStatus {
    Released,
    Closed,
}

#[derive(CandidType, Deserialize)]
pub struct SendCyclesArgs<TCycles> {
    pub canister: Principal,
    pub amount: TCycles,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, Eq, PartialEq)]
pub struct Canister {
    pub canister_id: Principal,
    pub status: Option<CanisterStatus>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct WalletInstallRequest {
    pub controller: Principal,
    pub cycles: Option<u128>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct WalletInstallResponse {
    pub(crate) canister_id: Principal,
    pub(crate) controller: Principal,
}

#[derive(CandidType, Deserialize)]
pub(crate) struct StableStorage {
    pub(crate) factory: FoxICFactory,
    pub(crate) owner: Principal,
}
