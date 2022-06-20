import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AccountBalanceArgs { 'account' : Array<number> }
export interface FoxICWallet {
  'transaction_fee' : Tokens,
  'subaccount' : [] | [Array<number>],
  'ledger_canister' : Principal,
  'watch_balances' : Array<[Array<number>, Tokens]>,
}
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<[string, string]>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<[string, string]>,
  'upgrade' : [] | [boolean],
  'status_code' : number,
}
export type Result = { 'Ok' : bigint } |
  { 'Err' : string };
export interface SendArgsSimple { 'account_id' : string, 'amount' : Tokens }
export interface Tokens { 'e8s' : bigint }
export interface TransferArgs {
  'sub_account_to' : [] | [Array<number>],
  'principal_to' : Principal,
  'amount' : Tokens,
}
export interface _SERVICE {
  'get_owner' : ActorMethod<[], string>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'is_owner' : ActorMethod<[], boolean>,
  'set_conf' : ActorMethod<[FoxICWallet], undefined>,
  'set_owner' : ActorMethod<[Principal], undefined>,
  'wallet_address_get' : ActorMethod<[[] | [Array<number>]], string>,
  'wallet_balance_get' : ActorMethod<[[] | [AccountBalanceArgs]], Tokens>,
  'wallet_icp_send' : ActorMethod<[SendArgsSimple], Result>,
  'wallet_icp_transfer' : ActorMethod<[TransferArgs], Result>,
  'wallet_url_get' : ActorMethod<[string], string>,
}
