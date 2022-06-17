import file from 'fs';
import shell from 'shelljs';
import yargs from 'yargs';

import { config, CanisterConfig } from './config';

const argv = yargs
  .option('idl', {
    alias: 'i',
    description: 'build idl only',
    type: 'boolean',
  })
  .help()
  .alias('help', 'h').argv;

function buildDID(canisterConfig: CanisterConfig) {
  if (
    (
      argv as {
        [x: string]: unknown;
        idl: boolean;
        _: (string | number)[];
        $0: string;
      }
    ).idl
  ) {
    shell.exec(`
    EGO_DIR="${process.cwd()}/${canisterConfig.category}/${
      canisterConfig.package
    }"
    didc bind $EGO_DIR/${
      canisterConfig.package
    }.did -t ts > ${process.cwd()}/clients/idls/${canisterConfig.package}.d.ts
    didc bind $EGO_DIR/${
      canisterConfig.package
    }.did -t js > ${process.cwd()}/clients/idls/${canisterConfig.package}.idl.js
    `);
  } else {
    shell.exec(`
    EGO_DIR="${process.cwd()}/${canisterConfig.category}/${
      canisterConfig.package
    }"
    cd $EGO_DIR && cargo run ${canisterConfig.bin_name} > $EGO_DIR/${
      canisterConfig.package
    }.did
    didc bind $EGO_DIR/${
      canisterConfig.package
    }.did -t ts > ${process.cwd()}/clients/idls/${canisterConfig.package}.d.ts
    didc bind $EGO_DIR/${
      canisterConfig.package
    }.did -t js > ${process.cwd()}/clients/idls/${canisterConfig.package}.idl.js
    `);
  }
}

function runBuildRust(config: CanisterConfig) {
  // buildDID();
  const constantFile = file
    .readFileSync(process.cwd() + '/configs/constant.json')
    .toString('utf8');

  const staging = JSON.parse(constantFile)['staging'];
  if (staging === 'production') {
    // getSnapshot();
    shell.exec(`
        EGO_DIR="${process.cwd()}/${config.category}/${config.package}" 
        TARGET="wasm32-unknown-unknown"
        cargo build --manifest-path "$EGO_DIR/Cargo.toml" --target $TARGET --release -j1
        cargo install ic-cdk-optimizer --version 0.3.1
        STATUS=$?
        if [ "$STATUS" -eq "0" ]; then
               ic-cdk-optimizer \
               "$EGO_DIR/../target/$TARGET/release/${config.package}.wasm" \
               -o "$EGO_DIR/${config.package}_opt.wasm"
        
           true
         else
           echo Could not install ic-cdk-optimizer.
           false
         fi
        `);
    // buildDID();
  } else {
    // getSnapshot();
    shell.exec(`
        EGO_DIR="${process.cwd()}/${config.category}/${config.package}" 
        TARGET="wasm32-unknown-unknown"
        cargo build --manifest-path "$EGO_DIR/Cargo.toml" --target $TARGET --release -j1
        `);
    // buildDID();
  }
}

function runEgoBuilder() {
  config.forEach(c => {
    runBuildRust(c);
    buildDID(c);
  });
}

runEgoBuilder();
