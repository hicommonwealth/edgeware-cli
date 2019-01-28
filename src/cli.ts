#!/usr/bin/env ts-node

import fs from 'fs';
import program from 'commander';
import Keyring from '@polkadot/keyring';
import { isHex, hexToU8a, stringToU8a } from '@polkadot/util/';
import { isQuery, makeQuery, isTx, makeTx, queryType, txType } from './util';
import { default as initApi } from './index';

import { version } from '../package.json';

program.version(version)
  .name('yarn api')
  .usage('<module> <function> [ARGS...]')
  .arguments('<mod> <func> [args...]')
  .action(async (mod, func, args) => {
    if (typeof mod === 'undefined') {
      console.error('\nNo module provided!\n');
      program.outputHelp();
      process.exit(1);
    }

    if (typeof program.remoteNode === 'undefined') {
      console.error('Defaulting to local node 127.0.0.1:9944');
      program.remoteNode = '127.0.0.1:9944';
    } else if (program.remoteNode.indexOf(':') === -1) {
      program.remoteNode += ':9944';
    }

    if (typeof func === 'undefined') {
      console.error('\nNo module function provided!\n');
      program.outputHelp();
      process.exit(1);
    }

    const api = await initApi(program.remoteNode);
    await api.isReady;

    if (isQuery(api, mod, func)) {
      if (program.types) {
        console.log(queryType(api, mod, func));
        process.exit(0);
      }
      console.log(`Making query: ${mod}.${func}("${args}")`);
      try {
        const result = await makeQuery(api, mod, func, args);
        // TODO: fix this result-fetching code to handle BN correctly
        console.log(result ? result.toString() : result);
        process.exit(0);
      } catch (err) {
        console.log('Failed: ', err);
        process.exit(1);
      }
    }

    if (isTx(api, mod, func)) {
      if (program.types) {
        console.log(txType(api, mod, func));
        process.exit(0);
      }

      if (typeof program.seed === 'undefined') {
        console.error('\nNo account seed provided!\n');
        program.outputHelp();
        process.exit(1);
      }

      console.log(`Making tx: ${mod}.${func}("${args}")`);
      const keyring = new Keyring();
      // TODO: make sure seed is properly formatted (32 byte hex string)

      const seedStr = program.seed.padEnd(32, ' ');
      const seed = isHex(program.seed) ? hexToU8a(seedStr) : stringToU8a(seedStr);

      const user = keyring.addFromSeed(seed);
      if (mod === 'upgradeKey' && func === 'upgrade') {
          const wasm = fs.readFileSync(args[0]).toString('hex');
          args = [`0x${wasm}`];
      }
      try {
        const result = await makeTx(api, mod, func, user, args);
        console.log(result.toString());
        process.exit(0);
      } catch (err) {
        console.log('Failed: ', err);
        process.exit(1);
      }
    }

    process.exit(1);
  })
  .option('-s, --seed <key>', 'Public/private keypair seed')
  .option('-r, --remoteNode <url>', 'Remote node url (default: "localhost:9944").')
  .option('-t, --types', 'Print types instead of performing action.');

program.on('--help', () => {
  console.log('');
  console.log('Examples (TODO):');
  console.log('  yarn api --seed Alice identity publish "www.github.com/drewstone"\n');
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
  process.exit(1);
}
