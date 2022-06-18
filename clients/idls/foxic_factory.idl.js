export const idlFactory = ({ IDL }) => {
  const WalletInstallResponse = IDL.Record({
    controller: IDL.Principal,
    canister_id: IDL.Principal,
  });
  const Result = IDL.Variant({
    Ok: WalletInstallResponse,
    Err: IDL.Text,
  });
  const CanisterStatus = IDL.Variant({
    Closed: IDL.Null,
    Released: IDL.Null,
  });
  const Canister = IDL.Record({
    status: IDL.Opt(CanisterStatus),
    canister_id: IDL.Principal,
  });
  const FoxICFactory = IDL.Record({
    wallet_wasm: IDL.Vec(IDL.Nat8),
    holders: IDL.Vec(IDL.Tuple(IDL.Principal, Canister)),
  });
  return IDL.Service({
    add_owner: IDL.Func([IDL.Principal], [], []),
    factory_wallet_install: IDL.Func([], [Result], []),
    factory_wallet_upload: IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    greeting: IDL.Func([IDL.Text], [IDL.Text], ['query']),
    is_owner: IDL.Func([], [IDL.Bool], ['query']),
    set_conf: IDL.Func([FoxICFactory], [], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
