import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Result = { Ok: WalletInstallResponse } | { Err: string };
export interface WalletInstallResponse {
  controller: Principal;
  canister_id: Principal;
}
export interface _SERVICE {
  factory_wallet_install: ActorMethod<[], Result>;
  factory_wallet_upload: ActorMethod<[Array<number>], undefined>;
  greeting: ActorMethod<[string], string>;
}
