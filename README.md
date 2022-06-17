# ICSnap

## How it works

1. Use Metamask Flask to hold a Snap Wallet with IC defined identity(Secp256k1). --- IC identity with metamask
2. Use Metamask Flask to install a wallet canister, can send and receive ICP. --- Canister hold/transfer ICP
3. Simulate RPC calls inside Canister and let user to configure Metamask to display ICP. --- Metamask Integration

## Components and install instructions

1. Metamask Flask
   uninstall old metamask, and install 👇
   Metamask Flask: [download](https://metamask.io/flask/)

## Build

```bash
yarn install && yarn build:all && yarn demo:local
```
