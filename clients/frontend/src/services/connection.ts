import { Actor, ActorSubclass, HttpAgent, SignIdentity } from "@dfinity/agent";
import { InterfaceFactory } from "@dfinity/candid/lib/cjs/idl";
import { idlFactory } from '../candid/foxic_factory.idl';
import { _SERVICE } from '../candid/foxic_factory';
const canisterId = 'gfjra-iaaaa-aaaai-aclia-cai';
export interface CreateActorResult<T> {
  actor: ActorSubclass<T>;
  agent: HttpAgent;
}

export async function _createActor<T>(
  interfaceFactory: InterfaceFactory,
  canisterId: string,
  identity?: SignIdentity,
  host?: string,
): Promise<CreateActorResult<T>> {
  console.log('ENV', ENV)
  const agent = new HttpAgent({ identity, host: host ?? ENV !== 'production' ? 'http://localhost:8000' : 'https://ic0.app' });
  // Only fetch the root key when we're not in prod
  if (ENV !== 'production') {
    await agent.fetchRootKey();
  }
  const actor = Actor.createActor<T>(interfaceFactory, {
    agent,
    canisterId,
  });
  return { actor, agent };
}


export async function getActor<T>(interfaceFactory: InterfaceFactory, canisterId: string) {
  return await _createActor<T>(interfaceFactory, canisterId)
}

export const connection = await getActor<_SERVICE>(idlFactory, canisterId);