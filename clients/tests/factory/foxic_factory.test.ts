import { hasOwnProperty } from '@/settings/utils';
import {
  factoryActor,
  actorCreateForFactory,
  FactoryActor,
  FactoryService,
  WalletService,
  WalletIDL,
} from './config';
import fs from 'fs';
import path from 'path';
import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { identity } from '@/settings/identity';
import { getActor } from '@/settings/agent';

describe('foxic factory test', () => {
  let factory: ActorSubclass<FactoryService> | undefined;
  let wallet: ActorSubclass<WalletService> | undefined;
  let wallet_canister: Principal | undefined;
  beforeAll(async () => {
    factory = await factoryActor;
  }, 120000);

  test('upload wallet wasm', async () => {
    const wasm = fs.readFileSync(
      path.resolve(`canisters/foxic_wallet/foxic_wallet_opt.wasm`),
    );
    await factory?.factory_wallet_upload(Array.from(wasm));
  });

  // test('install wallet wasm', async () => {
  //   const hasWallet = await factory?.get_wallet();
  //   if (hasWallet && hasWallet.length === 0) {
  //     const uploadResult = await factory?.factory_wallet_install();
  //     if (uploadResult && hasOwnProperty(uploadResult, 'Ok')) {
  //       const { controller, canister_id } = uploadResult.Ok;
  //       wallet_canister = canister_id;

  //       wallet = await getActor(identity, WalletIDL, wallet_canister.toText());

  //       expect(identity.getPrincipal().toText()).toBe(controller.toText());
  //     }
  //   } else if (hasWallet && hasWallet.length === 1) {
  //     wallet_canister = hasWallet[0].canister_id;
  //     wallet = await getActor(identity, WalletIDL, wallet_canister.toText());
  //     expect(identity.getPrincipal().toText()).toBe(
  //       hasWallet[0].controller[0]!.toText(),
  //     );
  //   }
  // });

  // test('is preset identity is owner of installed wallet', async () => {
  //   const isOwner = await wallet?.is_owner();
  //   expect(isOwner).toBe(true);
  // });
});
