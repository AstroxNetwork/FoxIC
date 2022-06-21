import type { Principal } from "@dfinity/principal"
import type { ActorMethod } from "@dfinity/agent"

export interface Canister {
  controller: [] | [Principal]
  status: [] | [CanisterStatus]
  canister_id: Principal
}
export type CanisterStatus = { Closed: null } | { Released: null }
export interface FoxICFactory {
  wallet_wasm: Array<number>
  holders: Array<[Principal, Canister]>
}
export type Result = { Ok: WalletInstallResponse } | { Err: string }
export interface WalletInstallResponse {
  controller: Principal
  canister_id: Principal
}
export interface _SERVICE {
  add_owner: ActorMethod<[Principal], undefined>
  factory_wallet_install: ActorMethod<[], Result>
  factory_wallet_uninstall: ActorMethod<[], Result>
  factory_wallet_upgrade: ActorMethod<[], Result>
  factory_wallet_upload: ActorMethod<[Array<number>], undefined>
  get_wallet: ActorMethod<[], [] | [Canister]>
  greeting: ActorMethod<[string], string>
  is_owner: ActorMethod<[], boolean>
  set_conf: ActorMethod<[FoxICFactory], undefined>
}
