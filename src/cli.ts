#!/usr/bin/env ts-node

import fs from 'fs';
import program from 'commander';
import Keyring from '@polkadot/keyring';
import { isHex, hexToU8a, stringToU8a } from '@polkadot/util/';
import { CodecArg } from '@polkadot/types/types';
import { isQuery, isTx, queryType, txType } from './util';
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
      program.remoteNode = 'ws://127.0.0.1:9944';
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

    // output a seed's public key with: `yarn api decodeSeed <seed>`
    if (mod.toLowerCase() === 'decodeseed') {
      const keyring = new Keyring();
      const seed = isHex(func)
      ? hexToU8a(func.padEnd(32, ' '))
      : stringToU8a(func.padEnd(32, ' '));

      const user = keyring.addFromSeed(seed);
      console.log(user.address());
    }

    // list all the txs and queries within mod with: `yarn api <mod> list`
    if (func.toLowerCase() === 'list') {
      if (api.query[mod] && api.tx[mod]) {
        console.log('\nQueries:');
        for (const key of Object.keys(api.query[mod])) {
          console.log(queryType(api, mod, key));
        }
        console.log('\nTransactions:');
        for (const key of Object.keys(api.tx[mod])) {
          console.log(txType(api, mod, key));
        }
        process.exit(0);
      } else {
        console.error(`No module ${mod} found.`);
        process.exit(1);
      }
    }

    if (isQuery(api, mod, func)) {
      if (program.types) {
        console.log(queryType(api, mod, func));
        process.exit(0);
      }
      console.log(`Making query: ${mod}.${func}("${args}")`);
      try {
        const result = await api.query[mod][func](...args);
        console.log(result ? result.toString() : result);
        process.exit(0);
      } catch (err) {
        console.error('Failed: ', err);
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
        const cArgs: CodecArg[] = args;
        const result = await api.tx[mod][func](...cArgs).signAndSend(user);
        console.log(JSON.stringify(result));
        process.exit(0);
      } catch (err) {
        console.error('Failed: ', err);
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
  console.log('  yarn api --seed Alice identity register "www.github.com/drewstone"\n');
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
  process.exit(1);
}
