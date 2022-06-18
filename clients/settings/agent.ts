/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Actor, ActorSubclass, HttpAgent, SignIdentity } from '@dfinity/agent';
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl';

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
  const agent = new HttpAgent({
    identity,
    host:
      host ?? process.env.NODE_ENV !== 'production'
        ? 'http://localhost:8000'
        : 'https://ic0.app',
  });
  // Only fetch the root key when we're not in prod
  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }
  const actor = Actor.createActor<T>(interfaceFactory, {
    agent,
    canisterId,
  });
  return { actor, agent };
}

export async function getActor<T>(
  signIdentity: SignIdentity,
  interfaceFactory: InterfaceFactory,
  canisterId: string,
): Promise<ActorSubclass<T>> {
  const actor = await _createActor<T>(
    interfaceFactory,
    canisterId,
    signIdentity,
  );

  return actor.actor;
}
