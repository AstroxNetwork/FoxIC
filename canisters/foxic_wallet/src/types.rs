use ic_cdk::api::*;

use ic_cdk::export::candid::CandidType;
use ic_ledger_types::{AccountIdentifier, Subaccount, Tokens};
use ic_types::Principal;
use json_rpc_types::Id;
use serde::{Deserialize, Serialize};

/// A key-value pair for a HTTP header.
#[derive(CandidType, Deserialize, Clone)]
pub struct HeaderField(pub String, pub String);

/// The important components of an HTTP request.
#[derive(CandidType, Deserialize, Clone)]
pub struct HttpRequest {
    /// The HTTP method string.
    pub method: String,
    /// The URL that was visited.
    pub url: String,
    /// The request headers.
    pub headers: Vec<HeaderField>,
    /// The request body.
    // #[serde(with = "serde_bytes")]
    pub body: Vec<u8>,
}

/// A HTTP response.
#[derive(CandidType)]
pub struct HttpResponse {
    /// The HTTP status code.
    pub status_code: u16,
    /// The response header map.
    pub headers: Vec<HeaderField>,
    /// The response body.
    // #[serde(with = "serde_bytes")]
    pub body: Vec<u8>,
    /// Whether the query call should be upgraded to an update call.
    pub upgrade: Option<bool>,
}

/// `Eth` namespace
#[derive(CandidType, Debug, Clone)]
pub struct Eth {
    pub chain_id: u32,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct RPCResponse {
    pub jsonrpc: String,
    pub result: String,
    pub id: Option<Id>,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct FoxICWallet {
    pub ledger_canister: Principal,
    pub subaccount: Option<Subaccount>,
    pub transaction_fee: Tokens,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash)]
pub struct TransferArgs {
    pub amount: Tokens,
    pub principal_to: Principal,
    pub sub_account_to: Option<Subaccount>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash)]
pub struct SendArgs {
    pub amount: Tokens,
    pub account_id: AccountIdentifier,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash)]
pub struct SendArgsSimple {
    pub amount: Tokens,
    pub account_id: String,
}

/// Until the stable storage works better in the ic-cdk, this does the job just fine.
#[derive(CandidType, Deserialize)]
pub(crate) struct StableStorage {
    pub(crate) wallet: FoxICWallet,
    pub(crate) owner: Principal,
}

pub type RPCRequest = json_rpc_types::Request<Vec<serde_json::Value>>;

pub fn vec_to_u8_32(arr: Vec<u8>) -> [u8; 32] {
    if arr.len() != 32 {
        trap(format!("vec length is not {}", 32).as_str())
    }
    let mut res = [0; 32];
    for i in 0..arr.len() {
        res[i] = arr[i];
    }
    res
}
