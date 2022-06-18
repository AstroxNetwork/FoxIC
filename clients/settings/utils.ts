import fs from 'fs';
import path from 'path';
import { fetch } from 'cross-fetch';

if (!globalThis.fetch) {
  (globalThis as any).fetch = fetch;
}

export function hasOwnProperty<
  X extends Record<string, unknown>,
  Y extends PropertyKey,
>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function getCanisterId(configName: string): string | undefined {
  const isProd = process.env.NODE_ENV === 'production';
  let canisterId;
  if (isProd) {
    const icFile = fs.readFileSync(path.resolve('./canister_ids.json'), {
      encoding: 'utf8',
    });
    canisterId = JSON.parse(icFile)[configName].ic ?? undefined;
  } else {
    const localFile = fs.readFileSync(
      path.resolve(`./configs/${configName}.json`),
      { encoding: 'utf8' },
    );
    canisterId = JSON.parse(localFile).LOCAL_CANISTERID;
  }
  return canisterId;
}
