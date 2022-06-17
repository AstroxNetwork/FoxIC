use crate::http::res_200;
use crate::state::CONF;
use crate::types::{vec_to_u8_32, Eth, HttpResponse, RPCResponse};
use bigint::U512;
use candid::Principal;
use ic_ledger_types::{AccountBalanceArgs, AccountIdentifier, DEFAULT_SUBACCOUNT};

type RPCRequest = json_rpc_types::Request<Vec<serde_json::Value>>;
// type RPCResponse = json_rpc_types::Response<Vec<serde_json::Value>, Err>;

impl Default for Eth {
    fn default() -> Self {
        Eth { chain_id: 10086 }
    }
}

impl Eth {
    pub fn chain_id(&self, req: RPCRequest) -> HttpResponse {
        let res = RPCResponse {
            jsonrpc: "2.0".to_string(),
            result: format!("0x{:x}", self.chain_id).to_string(),
            id: req.id,
        };
        res_200(serde_json::to_vec(&res).unwrap())
    }
    pub fn block_number(&self, req: RPCRequest) -> HttpResponse {
        let res = RPCResponse {
            jsonrpc: "2.0".to_string(),
            result: format!("0x{:x}", ic_cdk::api::time()).to_string(),
            id: req.id,
        };
        res_200(serde_json::to_vec(&res).unwrap())
    }
    pub fn block_by_number(&self, req: RPCRequest) -> HttpResponse {
        let json = serde_json::json!(
        {
            "baseFeePerGas": "0x7",
            "miner": "0x0000000000000000000000000000000000000001",
            "number": format!("0x{:x}", ic_cdk::api::time()).to_string(),
            "hash": "0x0e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331",
            "parentHash": "0x9646252be9520f6e71339a8df9c55e4d7619deeb018d2a3f2d21fc165dde5eb5",
            "mixHash": "0x1010101010101010101010101010101010101010101010101010101010101010",
            "nonce": "0x0000000000000000",
            "sealFields": [
              "0xe04d296d2460cfb8472af2c5fd05b5a214109c25688d3704aed5484f9a7792f2",
              "0x0000000000000042"
            ],
            "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
            "logsBloom":  "0x0e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331",
            "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
            "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
            "stateRoot": "0xd5855eb08b3387c0af375e9cdb6acfc05eb8f519e419b874b6ff2ffda7ed1dff",
            "difficulty": "0x27f07",
            "totalDifficulty": "0x27f07",
            "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "size": "0x27f07",
            "gasLimit": "0x9f759",
            "minGasPrice": "0x9f759",
            "gasUsed": "0x9f759",
            "timestamp": "0x54e34e8e",
            "transactions": [],
            "uncles": []
          }
        );

        let res = RPCResponse {
            jsonrpc: "2.0".to_string(),
            result: json.to_string(),
            id: req.id,
        };
        res_200(serde_json::to_vec(&res).unwrap())
    }
    pub async fn balance(&self, address: &str, req: RPCRequest) -> HttpResponse {
        let wallet = CONF.with(|w| w.borrow().clone());

        let v8: [u8; 32] = hex::decode(address.to_string()).map_or_else(
            |e| ic_cdk::trap("account_id is not valid hex"),
            |f| vec_to_u8_32(f),
        );

        let icp = wallet
            .balance_of(Some(AccountBalanceArgs {
                account: AccountIdentifier::try_from(v8)
                    .map_or_else(|e| ic_cdk::trap(e.as_str()), |f| f),
            }))
            .await;

        let icp_512 = U512::from(icp.clone().unwrap().e8s() as u64);
        let p10 = U512::from(10000000000 as u64);

        let res = RPCResponse {
            jsonrpc: "2.0".to_string(),
            result: format!("{:#02x}", icp_512 * p10).to_string(),
            id: req.id,
        };
        res_200(serde_json::to_vec(&res).unwrap())
    }
    pub fn gas_price(&self, req: RPCRequest) -> HttpResponse {
        let res = RPCResponse {
            jsonrpc: "2.0".to_string(),
            result: format!("0x{:x}", 0u32).to_string(),
            id: req.id,
        };
        res_200(serde_json::to_vec(&res).unwrap())
    }
    pub fn estimate_gas(&self, req: RPCRequest) -> HttpResponse {
        let res = RPCResponse {
            jsonrpc: "2.0".to_string(),
            result: format!("0x{:x}", 0u32).to_string(),
            id: req.id,
        };
        res_200(serde_json::to_vec(&res).unwrap())
    }
    pub fn net_version(&self, req: RPCRequest) -> HttpResponse {
        let res = RPCResponse {
            jsonrpc: "2.0".to_string(),
            result: format!("0x{:x}", 1u32).to_string(),
            id: req.id,
        };
        res_200(serde_json::to_vec(&res).unwrap())
    }
    pub fn transaction_count(&self, req: RPCRequest) -> HttpResponse {
        let res = RPCResponse {
            jsonrpc: "2.0".to_string(),
            result: format!("0x{:x}", 0u32).to_string(),
            id: req.id,
        };
        res_200(serde_json::to_vec(&res).unwrap())
    }
}
