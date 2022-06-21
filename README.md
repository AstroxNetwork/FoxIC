# FoxIC

## Inspiration
People love and hate MetaMask so much, because it is so popular and have tremendous fans. We have Internet-Identity on IC, and many other wallets, but none of them are popular than the little Fox on the browser. 

Some of devs have tried integrate with MetaMask to IC, for example, ICWall, and AstroX ME ( yeah , we made it ). But all these solutions are not perfect, they use frontend generate identity and use it to sign. Unlike extension app runs on isolate environment of the browser.

Until we discover MetaMask Flask and some projects built on it. [FilSnap](https://github.com/ChainSafe/filsnap/tree/master/packages) inspired us and gave us good template to start with.

## What it does
* It can sign messages inside MetaMask, not in the frontend page, maybe more secure.
* From the signing function, we can use identity from MetaMask directly, just like normal extension wallet.
* We can use that identity to interact with canisters, and even control them.
* Build a frontend wallet is too easy, why not everyone controls a canister wallet?

## How we built it
* We have a seperate package called [ICSnap](https://github.com/AstroxNetwork/ICSnap) which is used to interact with MetaMask Flask environment and provide api to adapter.
* We have a adapter installed in frontend and combine with a wrapped identity, they are used to interact with canisters.
* We have a factory canister to provide registry and install wallet canister for users.
* We have a standard wallet canister for user, and set users to be controllers/owners.
* We use http response and heartbeat feature.

## Challenges we ran into
* Understanding MetaMask Flask takes time, but it's ok.
* Confirmation window pops each time when signing, we have to find a way to authorize once and allow signing without popping-up windows.
* Building canisters is fun, but managing them needs to be careful
* People want MetaMask to display and refresh ICP balance, many blockchain project have some configuration method but not ICP (we do not use RPC)
* Not happening if user's not controlling their own canisters.

## Accomplishments that we're proud of
* Signing with MetaMask Flask is done
* Build a wallet factory and make every-user adopts one.
* Simulate an RPC (mainly ethereum rpc request/response) but get correct result for ICP definitions.
* Heartbeat function works correctly to refresh balance in time. 

## What we learned
* Canisters are powerful, really pushing the boundary of blockchain technology.
* It's important for people to own canisters, not just assets but also functionality and composability.
* Security is first, usabilities are important, popularity is the trigger. Keep BUIDL.

## What's next for FoxIC
* Make ICP transaction happens inside MetaMask (in a way)
* Display TX history and contact books for user (store in canister and sync from it?)
* Waiting for ECDSA and BTC integration, extends the wallet canister.
* Support IC NFT or Tokens maybe.
