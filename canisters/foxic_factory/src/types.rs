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
    pub controller: Option<Principal>,
    pub status: Option<CanisterStatus>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct WalletInstallRequest {
    pub controller: Principal,
    pub cycles: Option<u128>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct WalletUpgradeRequest {
    pub controller: Principal,
    pub cycles: Option<u128>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct WalletUninstallRequest {
    pub controller: Principal,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct WalletInstallResponse {
    pub(crate) canister_id: Principal,
    pub(crate) controller: Principal,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct WalletUpgradeResponse {
    pub(crate) canister_id: Principal,
    pub(crate) controller: Principal,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct WalletUninstallResponse {
    pub(crate) canister_id: Principal,
    pub(crate) controller: Principal,
}

#[derive(CandidType, Deserialize)]
pub(crate) struct StableStorage {
    pub(crate) factory: FoxICFactory,
    pub(crate) manager_list: Vec<Principal>,
}

#[derive(CandidType, Deserialize)]
pub enum InstallMode {
    #[serde(rename = "install")]
    Install,
    #[serde(rename = "reinstall")]
    Reinstall,
    #[serde(rename = "upgrade")]
    Upgrade,
}

#[derive(CandidType, Deserialize)]
pub struct CanisterInstall {
    pub mode: InstallMode,
    pub canister_id: Principal,
    #[serde(with = "serde_bytes")]
    pub wasm_module: Vec<u8>,
    pub arg: Vec<u8>,
}

#[derive(CandidType, Deserialize)]
pub struct CanisterUnInstall {
    pub canister_id: Principal,
}
