import { ActorSubclass } from '@dfinity/agent';
import { idlFactory as FactoryIDL } from '@idls/foxic_factory.idl';
import { _SERVICE as _FactoryService } from '@idls/foxic_factory';
import { idlFactory as WalletIDL } from '@idls/foxic_wallet.idl';
import { _SERVICE as _WalletService } from '@idls/foxic_wallet';
import { getActor } from '@/settings/agent';
import { identity } from '@/settings/identity';
import { getCanisterId } from '@/settings/utils';
import { Ed25519KeyIdentity } from '@dfinity/identity';

const factoryCanisterId = getCanisterId('foxic_factory')!;
const factoryActor = getActor<_FactoryService>(
  identity,
  FactoryIDL,
  factoryCanisterId,
);

export type FactoryService = _FactoryService;
export type FactoryActor = ActorSubclass<_FactoryService>;
export type WalletService = _WalletService;
export type WalletActor = ActorSubclass<_WalletService>;

export {
  factoryActor,
  factoryCanisterId,
  FactoryIDL,
  actorCreateForFactory,
  WalletIDL,
};

async function actorCreateForFactory(
  index: number,
): Promise<ActorSubclass<_FactoryService>> {
  const arr = new Array(31);
  const arr2 = arr.fill(0, 0, 30).concat(index);
  const id = Ed25519KeyIdentity.generate(new Uint8Array(arr2));
  const userActor = await getActor<_FactoryService>(
    id,
    FactoryIDL,
    factoryCanisterId,
  );
  return userActor;
}
