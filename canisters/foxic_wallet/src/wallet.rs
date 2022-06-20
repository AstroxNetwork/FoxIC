use crate::types::{FoxICWallet, SendArgs, TransferArgs};
use ic_cdk::api::call::CallResult;
use ic_cdk::id;
use ic_ledger_types::{
    AccountBalanceArgs, AccountIdentifier, BlockIndex, Memo, Subaccount, Tokens,
    DEFAULT_SUBACCOUNT, MAINNET_LEDGER_CANISTER_ID,
};
use itertools::Itertools;

impl Default for FoxICWallet {
    fn default() -> Self {
        FoxICWallet {
            ledger_canister: MAINNET_LEDGER_CANISTER_ID,
            subaccount: None,
            transaction_fee: Tokens::from_e8s(10_000),
            watch_balances: Default::default(),
        }
    }
}

impl FoxICWallet {
    pub fn new() -> FoxICWallet {
        FoxICWallet {
            ledger_canister: MAINNET_LEDGER_CANISTER_ID,
            subaccount: None,
            transaction_fee: Tokens::from_e8s(10_000),
            watch_balances: Default::default(),
        }
    }

    pub fn update_watch(&mut self, account: AccountIdentifier, balance: Tokens) {
        self.watch_balances.insert(account, balance);
    }

    pub fn remove_watch(&mut self, account: AccountIdentifier) {
        self.watch_balances.remove(&account);
    }

    pub async fn balance_of(&self, args: Option<AccountBalanceArgs>) -> CallResult<Tokens> {
        Ok(ic_ledger_types::account_balance(
            self.ledger_canister,
            args.unwrap_or(AccountBalanceArgs {
                account: AccountIdentifier::new(&id(), &DEFAULT_SUBACCOUNT),
            }),
        )
        .await?)
    }

    pub fn get_address(&self, subaccount: Option<Subaccount>) -> String {
        AccountIdentifier::new(&id(), &subaccount.unwrap_or(DEFAULT_SUBACCOUNT)).to_string()
    }

    pub async fn transfer(&self, args: TransferArgs) -> Result<BlockIndex, String> {
        let sub_account_to = args.sub_account_to.unwrap_or(DEFAULT_SUBACCOUNT);
        let transfer_args = SendArgs {
            amount: args.amount,
            account_id: AccountIdentifier::new(&args.principal_to, &sub_account_to),
        };
        FoxICWallet::send(&self, transfer_args).await
    }

    pub async fn send(&self, args: SendArgs) -> Result<BlockIndex, String> {
        let transfer_args = ic_ledger_types::TransferArgs {
            memo: Memo(0),
            amount: args.amount,
            fee: self.transaction_fee,
            from_subaccount: self.subaccount,
            to: args.account_id,
            created_at_time: None,
        };
        ic_ledger_types::transfer(self.ledger_canister, transfer_args)
            .await
            .map_err(|e| format!("failed to call ledger: {:?}", e))?
            .map_err(|e| format!("ledger transfer error {:?}", e))
    }
}
