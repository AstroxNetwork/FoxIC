import file from 'fs';
import shell from 'shelljs';
import yargs from 'yargs';
import fs from 'fs';
import path from 'path';
import { Secp256k1KeyIdentity } from '@dfinity/identity';
import { config } from './config';
const bip39 = require('bip39');
const BIP32Factory = require('bip32');
const ecc = require('tiny-secp256k1');

function getIdentityFromPhrase(phrase: string) {
  const seed = bip39.mnemonicToSeedSync(phrase);

  const ICP_PATH = "m/44'/223'/0'";
  const path = `${ICP_PATH}/0/0`;

  const bip32 = BIP32Factory.default(ecc);

  let node = bip32.fromSeed(seed);

  let child = node.derivePath(path);

  return Secp256k1KeyIdentity.fromSecretKey(child.privateKey!);
  // return seed;
}

const seedPhrase = fs
  .readFileSync(path.join(process.cwd(), '/credentials', '/internal.txt'), {
    encoding: 'utf8',
  })
  .toString();

const identity = getIdentityFromPhrase(seedPhrase);

const argv = yargs
  .option('clean', {
    alias: 'c',
    description: 'clean .dfx/ folder',
    type: 'boolean',
  })
  .help()
  .alias('help', 'h').argv;

// run deploy

function runDeploy() {
  console.log(
    (
      argv as {
        [x: string]: unknown;
        clean: boolean;
        _: (string | number)[];
        $0: string;
      }
    ).clean,
  );
  for (const f of config) {
    const dfx_folder = process.cwd() + '/' + f.category + '/' + f.package;
    // const dfx_sh = dfx_folder + '/dfx.sh';
    if (
      (
        argv as {
          [x: string]: unknown;
          clean: boolean;
          _: (string | number)[];
          $0: string;
        }
      ).clean
    ) {
      if (f.private !== undefined) {
        const prv = file.readFileSync(dfx_folder + '/' + f.private);
        const pub = file.readFileSync(dfx_folder + '/' + f.public);
        file.writeFileSync(dfx_folder + '/dfx.json', prv);
        shell.exec(`cd ${dfx_folder} && rm -rf .dfx && sh dfx.sh`);
        file.writeFileSync(dfx_folder + '/dfx.json', pub);
      } else {
        shell.exec(`cd ${dfx_folder} && rm -rf .dfx && sh dfx.sh`);
      }
    } else {
      shell.exec(`cd ${dfx_folder} && sh dfx.sh`);
    }

    shell.exec(`cd ${dfx_folder} && dfx canister update-settings --all --add-controller "${identity.getPrincipal().toText()}"`);

    const localCanisterJson = file.readFileSync(dfx_folder + '/.dfx/local/canister_ids.json').toString('utf8');
    const localCanisterId = JSON.parse(localCanisterJson)[f.package]['local'];

    let configJson = JSON.stringify({});
    try {
      configJson = file.readFileSync(f.config).toString('utf8');
    } catch (error) {
      file.writeFileSync(f.config, JSON.stringify({}));
    }

    const configObject = {
      ...JSON.parse(configJson),
      LOCAL_CANISTERID: localCanisterId,
    };

    if (f.url) {
      Object.assign(configObject, {
        LOCAL_URL: `http://${localCanisterId}.localhost:8000`,
      });
    }

    file.writeFileSync(f.config, JSON.stringify(configObject));
  }
}

runDeploy();

// dfx canister --network ic --wallet "$(dfx identity --network ic get-wallet)" update-settings --all --add-controller "$(dfx identity get-principal)"
