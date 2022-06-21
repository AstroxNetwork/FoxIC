// use crate::state::WALLET;
use ic_cdk::export::candid::{CandidType, Nat};
use ic_cdk::export::Principal;
use ic_cdk::{api, id, trap};
use serde::Deserialize;
use std::collections::BTreeMap;

use crate::types::{
    Canister, CanisterInstall, CanisterUnInstall, InstallMode, WalletUninstallRequest,
    WalletUninstallResponse, WalletUpgradeResponse,
};
use crate::types::{CanisterStatus, WalletUpgradeRequest};
use crate::types::{WalletInstallRequest, WalletInstallResponse};

#[derive(Clone, CandidType, Deserialize)]
pub struct FoxICFactory {
    pub holders: BTreeMap<Principal, Canister>,
    pub wallet_wasm: Vec<u8>,
}

/***************************************************************************************************
 * Managing Canister
 **************************************************************************************************/
#[derive(CandidType, Clone, Deserialize)]
struct CanisterSettings {
    // dfx versions <= 0.8.1 (or other wallet callers expecting version 0.1.0 of the wallet)
    // will set a controller (or not) in the the `controller` field:
    controller: Option<Principal>,

    // dfx versions >= 0.8.2 will set 0 or more controllers here:
    controllers: Option<Vec<Principal>>,
    compute_allocation: Option<Nat>,
    memory_allocation: Option<Nat>,
    freezing_threshold: Option<Nat>,
}

#[derive(CandidType, Clone, Deserialize)]
struct CreateCanisterArgs<TCycles> {
    cycles: TCycles,
    settings: CanisterSettings,
}

#[derive(CandidType, Deserialize, Clone)]
struct UpdateSettingsArgs {
    canister_id: Principal,
    settings: CanisterSettings,
}

#[derive(CandidType, Deserialize, Clone)]
struct CreateResult {
    canister_id: Principal,
}

async fn _create_canister_call(args: CreateCanisterArgs<u128>) -> Result<CreateResult, String> {
    #[derive(CandidType)]
    struct In {
        settings: Option<CanisterSettings>,
    }
    let in_arg = In {
        settings: Some(args.settings),
    };

    let (create_result,): (CreateResult,) = match api::call::call_with_payment128(
        Principal::management_canister(),
        "create_canister",
        (in_arg,),
        args.cycles,
    )
    .await
    {
        Ok(x) => x,
        Err((code, msg)) => {
            return Err(format!(
                "An error happened during the _create_canister_call: {}: {}",
                code as u8, msg
            ));
        }
    };

    Ok(create_result)
}

async fn _install_wallet(canister_id: &Principal, wasm_module: Vec<u8>) -> Result<(), String> {
    // Install Wasm

    let install_config = CanisterInstall {
        mode: InstallMode::Install,
        canister_id: *canister_id,
        wasm_module: wasm_module.clone(),
        arg: b" ".to_vec(),
    };

    match api::call::call(
        Principal::management_canister(),
        "install_code",
        (install_config,),
    )
    .await
    {
        Ok(x) => x,
        Err((code, msg)) => {
            return Err(format!(
                "An error happened during the _install_wallet: {}: {}",
                code as u8, msg
            ));
        }
    };
    Ok(())
}

async fn _upgrade_wallet(canister_id: &Principal, wasm_module: Vec<u8>) -> Result<(), String> {
    // Install Wasm

    let install_config = CanisterInstall {
        mode: InstallMode::Upgrade,
        canister_id: *canister_id,
        wasm_module: wasm_module.clone(),
        arg: b" ".to_vec(),
    };

    match api::call::call_with_payment128(
        Principal::management_canister(),
        "install_code",
        (install_config,),
        200_000_000_000,
    )
    .await
    {
        Ok(x) => x,
        Err((code, msg)) => {
            return Err(format!(
                "An error happened during the _update_wallet: {}: {}",
                code as u8, msg
            ));
        }
    };
    Ok(())
}

async fn _uninstall_wallet(canister_id: &Principal) -> Result<(), String> {
    // Install Wasm
    let install_config = CanisterUnInstall {
        canister_id: *canister_id,
    };

    match api::call::call(
        Principal::management_canister(),
        "uninstall_code",
        (install_config,),
    )
    .await
    {
        Ok(x) => x,
        Err((code, msg)) => {
            return Err(format!(
                "An error happened during the _install_wallet: {}: {}",
                code as u8, msg
            ));
        }
    };
    Ok(())
}

impl FoxICFactory {
    pub fn new() -> Self {
        FoxICFactory {
            holders: Default::default(),
            wallet_wasm: vec![],
        }
    }

    pub async fn install_foxic_wallet(
        &mut self,
        request: WalletInstallRequest,
    ) -> Result<WalletInstallResponse, String> {
        if self.holders.get(&request.controller.clone()).is_some() {
            ic_cdk::trap("Each caller can only have one wallet, Truly Sorry!!");
        }

        let default_cycles = 800_000_000_000 as u128;
        let create_canister_arg = CreateCanisterArgs {
            cycles: request.cycles.unwrap_or(default_cycles).clone() as u128,
            settings: CanisterSettings {
                controller: None,
                controllers: Some(vec![request.controller.clone(), id()]),
                compute_allocation: None,
                memory_allocation: None,
                freezing_threshold: None,
            },
        };
        let create_result = _create_canister_call(create_canister_arg).await?;

        match _install_wallet(&create_result.canister_id, self.wallet_wasm.clone()).await {
            Ok(_) => {
                match api::call::call(
                    create_result.canister_id.clone(),
                    "set_owner",
                    (request.controller.clone(),),
                )
                .await as Result<((),), _>
                {
                    Ok(_) => {
                        self.holders.insert(
                            request.controller.clone(),
                            Canister {
                                canister_id: create_result.canister_id.clone(),
                                controller: Some(request.controller.clone()),
                                status: Some(CanisterStatus::Released),
                            },
                        );

                        Ok(WalletInstallResponse {
                            canister_id: create_result.canister_id.clone(),
                            controller: request.controller.clone(),
                        })
                    }
                    Err(_) => Err("Set owner result".to_string()),
                }
            }
            Err(e) => Err(e),
        }
    }

    pub async fn upgrade_wallet(
        &mut self,
        request: WalletUpgradeRequest,
    ) -> Result<WalletUpgradeResponse, String> {
        let canister = self.holders.get(&request.controller.clone());
        if canister.is_none() {
            ic_cdk::trap("No controller found, sorry");
        }
        let canister_id = canister.unwrap().canister_id;

        match _upgrade_wallet(&canister_id.clone(), self.wallet_wasm.clone()).await {
            Ok(_) => Ok(WalletUpgradeResponse {
                canister_id: canister_id.clone(),
                controller: request.controller.clone(),
            }),
            Err(e) => Err(e),
        }
    }

    pub async fn uninstall_wallet(
        &mut self,
        request: WalletUninstallRequest,
    ) -> Result<WalletUninstallResponse, String> {
        let canister = self.holders.get(&request.controller.clone());
        if canister.is_none() {
            ic_cdk::trap("No controller found, sorry");
        }
        let canister_id = canister.unwrap().canister_id;

        match _uninstall_wallet(&canister_id.clone()).await {
            Ok(_) => {
                self.holders
                    .remove(&request.controller.clone())
                    .unwrap_or_else(|| trap("remove canister fail"));
                Ok(WalletUninstallResponse {
                    canister_id: canister_id.clone(),
                    controller: request.controller.clone(),
                })
            }
            Err(e) => Err(e),
        }
    }

    pub fn get_wallet(&self, controller: Principal) -> Option<Canister> {
        match self.holders.get(&controller) {
            None => None,
            Some(r) => Some(r.clone()),
        }
    }

    // we should not use it in production
    pub fn upload_wallet_wasm(&mut self, wasm_bytes: Vec<u8>) {
        self.wallet_wasm = wasm_bytes
    }
}
