export const idlFactory = ({ IDL }) => {
  const HttpRequest = IDL.Record({
    url: IDL.Text,
    method: IDL.Text,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const HttpResponse = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    upgrade: IDL.Opt(IDL.Bool),
    status_code: IDL.Nat16,
  });
  const Tokens = IDL.Record({ e8s: IDL.Nat64 });
  const FoxICWallet = IDL.Record({
    transaction_fee: Tokens,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    ledger_canister: IDL.Principal,
    watch_balances: IDL.Vec(IDL.Tuple(IDL.Vec(IDL.Nat8), Tokens)),
  });
  const AccountBalanceArgs = IDL.Record({ account: IDL.Vec(IDL.Nat8) });
  const SendArgsSimple = IDL.Record({
    account_id: IDL.Text,
    amount: Tokens,
  });
  const Result = IDL.Variant({ Ok: IDL.Nat64, Err: IDL.Text });
  const TransferArgs = IDL.Record({
    sub_account_to: IDL.Opt(IDL.Vec(IDL.Nat8)),
    principal_to: IDL.Principal,
    amount: Tokens,
  });
  return IDL.Service({
    cycle_balance: IDL.Func([], [IDL.Nat], []),
    get_owner: IDL.Func([], [IDL.Text], ['query']),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
    is_owner: IDL.Func([], [IDL.Bool], ['query']),
    set_conf: IDL.Func([FoxICWallet], [], []),
    set_owner: IDL.Func([IDL.Principal], [], []),
    wallet_address_get: IDL.Func(
      [IDL.Opt(IDL.Vec(IDL.Nat8))],
      [IDL.Text],
      ['query'],
    ),
    wallet_balance_get: IDL.Func([IDL.Opt(AccountBalanceArgs)], [Tokens], []),
    wallet_icp_send: IDL.Func([SendArgsSimple], [Result], []),
    wallet_icp_transfer: IDL.Func([TransferArgs], [Result], []),
    wallet_url_get: IDL.Func([IDL.Text], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => {
  return [];
};
