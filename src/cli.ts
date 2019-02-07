#!/usr/bin/env ts-node

import fs from 'fs';
import program from 'commander';
import Keyring from '@polkadot/keyring';
import { isHex, hexToU8a, stringToU8a } from '@polkadot/util/';
import { CodecArg } from '@polkadot/types/types';
import { isQuery, isTx, queryType, txType } from './util';
import { initApiRx } from './index';
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

    const api = await initApiRx();
    await api.isReady;

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
        const cArgs: CodecArg[] = args;
        const result = await api.tx[mod][func](...cArgs)
        .signAndSend(user)
        .subscribe(({ events = [], status, type }) => {
          // Log transfer events
          console.log('Transfer status:', type);
          // Log system events once the transfer is finalised
          if (type === 'Finalised') {
            console.log('Completed at block hash', status.asFinalised.toHex());

            console.log('Events:');
            events.forEach(({ phase, event: { data, method, section } }) => {
              console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
            });
            process.exit(0);
          }
        });
        // console.log(JSON.stringify(result));
      } catch (err) {
        console.log('Failed: ', err);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  })
  .option('-s, --seed <key>', 'Public/private keypair seed')
  .option('-r, --remoteNode <url>', 'Remote node url (default: "localhost:9944").')
  .option('-t, --types', 'Print types instead of performing action.');

program.on('--help', () => {
  console.log('');
  console.log('Examples (TODO):');
  console.log('  yarn api --seed Alice identity register github drewstone\n');
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
  process.exit(1);
}
