import { Actor, ActorSubclass, HttpAgent, SignIdentity } from "@dfinity/agent"
import { InterfaceFactory } from "@dfinity/candid/lib/cjs/idl"
import { idlFactory } from "../candid/foxic_factory.idl"
import { _SERVICE } from "../candid/foxic_factory"
import { idlFactory as walletIdlFactory } from "../candid/foxic_wallet.idl"
import { _SERVICE as wallet_SERVICE } from "../candid/foxic_wallet"
const factoryCanisterId = "qjdve-lqaaa-aaaaa-aaaeq-cai"
console.log(factoryCanisterId)
console.log(process.env.NODE_ENV)
export interface CreateActorResult<T> {
  actor: ActorSubclass<T>
  agent: HttpAgent
}

export async function _createActor<T>(
  interfaceFactory: InterfaceFactory,
  canisterId: string,
  identity?: SignIdentity,
  host?: string,
): Promise<CreateActorResult<T>> {
  const agent = new HttpAgent({
    identity,
    host:
      host ?? process.env.NODE_ENV !== "production"
        ? "http://localhost:8000"
        : "https://ic0.app",
  })
  // Only fetch the root key when we're not in prod
  if (process.env.NODE_ENV !== "production") {
    await agent.fetchRootKey()
  }
  const actor = Actor.createActor<T>(interfaceFactory, {
    agent,
    canisterId,
  })
  return { actor, agent }
}

export async function getActor<T>(
  interfaceFactory: InterfaceFactory,
  canisterId: string,
  identity: SignIdentity,
) {
  return await _createActor<T>(interfaceFactory, canisterId, identity)
}

export async function getFactoryConnect(identity: SignIdentity) {
  const connection = await getActor<_SERVICE>(
    idlFactory,
    factoryCanisterId,
    identity,
  )
  return connection
}
export async function getWalletConnect(
  identity: SignIdentity,
  canisterId: string,
) {
  console.log("getWalletConnect", canisterId)
  const connection = await getActor<wallet_SERVICE>(
    walletIdlFactory,
    canisterId,
    identity,
  )
  return connection
}
// export const connection = await getActor<_SERVICE>(idlFactory, canisterId, identity);
