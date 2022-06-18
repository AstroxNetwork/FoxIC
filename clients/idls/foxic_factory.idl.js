export const idlFactory = ({ IDL }) => {
  const WalletInstallResponse = IDL.Record({
    controller: IDL.Principal,
    canister_id: IDL.Principal,
  });
  const Result = IDL.Variant({
    Ok: WalletInstallResponse,
    Err: IDL.Text,
  });
  return IDL.Service({
    factory_wallet_install: IDL.Func([], [Result], []),
    factory_wallet_upload: IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    greeting: IDL.Func([IDL.Text], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => {
  return [];
};
