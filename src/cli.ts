#!/usr/bin/env ts-node
require('dotenv').config();
import { version } from '../package.json';
const fs = require('fs');
const program = require('commander');
import Keyring from '@polkadot/keyring';
import { isHex, hexToU8a, stringToU8a } from '@polkadot/util';
import { CodecArg } from '@polkadot/types/types';
import { ApiRx, SubmittableResult } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { IdentityTypes } from './edgeware-node-types/types/identity';
import { VotingTypes } from './edgeware-node-types/types/voting';
import { GovernanceTypes } from './edgeware-node-types/types/governance';
import { ApiOptions } from '@polkadot/api/types';
import { switchMap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';

const EDGEWARE_TESTNET_PUBLIC_CONN = '18.223.143.102:9944';

const isQuery = (api: ApiRx, mod: string, func: string) => {
  return api.query[mod] && !!api.query[mod][func];
};

const queryType = (api: ApiRx, mod: string, func: string) => {
  const t = api.query[mod][func].meta.type;
  if (t.isMap) {
    return `query.${mod}.${func}: ` + t.asMap.key.toString() + ' -> ' + t.asMap.value.toString();
  } else {
    return `query.${mod}.${func}: ` + t.asType.toString();
  }
};

const isDerive = (api: ApiRx, mod: string, func: string) => {
  return api.derive[mod] && !!api.derive[mod][func];
};

const deriveType = (api: ApiRx, mod: string, func: string) => {
  const d = api.derive[mod][func];
  return 'Cannot get types of derive.';
};

const isTx = (api: ApiRx, mod: string, func: string) => {
  return api.tx[mod] && api.tx[mod][func];
};

const txType = (api: ApiRx, mod: string, func: string) => {
  const args = api.tx[mod][func].meta.arguments;
  let result = `tx.${mod}.${func}: (`;
  args.forEach((t) => {
    result += t.name + ': ' + t.type + ', ';
  });
  return result + ') -> ()';
};

function initApiRx(remoteNodeUrl?: string) {
  if (!remoteNodeUrl) {
    remoteNodeUrl = 'ws://localhost:9944';
  }

  if (remoteNodeUrl.indexOf('ws://') === -1) {
    remoteNodeUrl = `ws://${remoteNodeUrl}`;
  }

  const options: ApiOptions = {
    provider : new WsProvider(remoteNodeUrl),
    types : {
      ...IdentityTypes,
      ...GovernanceTypes,
      ...VotingTypes,
    },
  };
  const api = new ApiRx(options);
  return api;
}

program.version(version)
  .name('yarn api')
  .usage('<module> <function> [ARGS...]')
  .arguments('<mod> <func> [args...]')
  .action(async (mod: string, func: string, args: string[]) => {
    if (typeof program.remoteNode === 'undefined') {
      console.error('Defaulting to local node 127.0.0.1:9944');
      program.remoteNode = 'ws://127.0.0.1:9944';
    } else if (program.remoteNode === 'edgeware') {
      program.remoteNode = `ws://${EDGEWARE_TESTNET_PUBLIC_CONN}`;
    } else if (program.remoteNode.indexOf(':') === -1) {
      program.remoteNode += ':9944';
    }

    const listing = (func.toLowerCase() === 'list');
    const tailing = !!program.tail;

    const apiObservable = await initApiRx(program.remoteNode).isReady;
    apiObservable.pipe(switchMap((api: ApiRx) => {
      // List the available actions then exit
      if (listing) {
        if (api.query[mod]) {
          console.log('\nQueries:');
          for (const key of Object.keys(api.query[mod])) {
            console.log(queryType(api, mod, key));
          }
        }
        if (api.tx[mod]) {
          console.log('\nTransactions:');
          for (const key of Object.keys(api.tx[mod])) {
            console.log(txType(api, mod, key));
          }
        }
        if (!api.tx[mod] && !api.query[mod]) {
          console.error(`No module ${mod} found.`);
          process.exit(1);
        } else {
          process.exit(0);
        }
      }
      if (isQuery(api, mod, func)) {
        if (program.types) {
          console.log(queryType(api, mod, func));
          process.exit(0);
        }

        console.log(`Making query: ${mod}.${func}("${args}")`);
        const cArgs: CodecArg[] = args;
        return combineLatest(of(true), api.query[mod][func](...cArgs));
      }

      if (isDerive(api, mod, func)) {
        if (program.types) {
          console.log(deriveType(api, mod, func));
          process.exit(0);
        }
        console.log(`Making query: ${mod}.${func}("${args}")`);
        const cArgs: CodecArg[] = args;
        return combineLatest(of(true), api.derive[mod][func](...cArgs));
      }
      if (isTx(api, mod, func)) {
        if (program.types) {
          console.log(txType(api, mod, func));
          process.exit(0);
        }

        if (typeof program.seed === 'undefined' && (
            typeof process.env.MNEMONIC_PHRASE === 'undefined' ||
            typeof process.env.DERIVATION_PATH === 'undefined'
        )) {
          console.error('\nNo seed phrase provided!\n');
          program.outputHelp();
          process.exit(1);
        }

        let pair;
        // Passing in mnemonic and derivation path will be interpreted as ed25519 key
        if (typeof program.seed === 'undefined') {
          const keyring = new Keyring({ type: 'ed25519' });
          pair = keyring.addFromUri(`${process.env.MNEMONIC_PHRASE}${process.env.DERIVATION_PATH}`);
        } else {
          // Make it work for simple seeds like `Alice` as well as hex seeds using sr25519
          const keyring = new Keyring({ type: 'sr25519' });
          if (isHex(program.seed)) {
            pair = keyring.addFromUri(`\/\/${program.seed}`);
          } else {
            pair = keyring.addFromUri(`${program.seed}`);
          }
        }

        console.log(pair.address());
        console.log(`Making tx: ${mod}.${func}("${args}")`);

        if (mod === 'upgradeKey' && func === 'upgrade') {
          const wasm = fs.readFileSync(args[0]).toString('hex');
          args = [`0x${wasm}`];
        }
        const cArgs: CodecArg[] = args;
        return combineLatest(of(false), api.tx[mod][func](...cArgs).signAndSend(pair));
      }
    }))
    .subscribe(([didQuery, result]: [boolean, SubmittableResult]) => {
      if (didQuery) {
        console.log(JSON.stringify(result));
        if (!tailing) {
          process.exit(0);
        }
      } else {
        // Log transfer events
        console.log('Transfer status:', result.status.type);
        // Log system events once the transfer is finalised
        if (result.status.isFinalized) {
          console.log('Completed at block hash', result.status.asFinalized.toHex());

          console.log('Events:');
          result.events.forEach(({ phase, event: { data, method, section } }) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
          });
          process.exit(0);
        }
      }
    }, (err) => {
      console.log('Failed: ', err);
      process.exit(1);
    });
  })
  .option('-s, --seed <hexSeed>', 'A seed for signing transactions')
  .option('-r, --remoteNode <url>', 'Remote node url (default: "localhost:9944").')
  .option('-T, --types', 'Print types instead of performing action.')
  .option('-t, --tail', 'Tail output rather than exiting immediately.');

program.on('--help', () => {
  console.log('');
  console.log('Examples (TODO):');
  console.log('  yarn api --seed Alice identity register github drewstone\n');
  console.log('  yarn api --seed Alice balances transfer 5FmE1Adpwp1bT1oY95w59RiSPVu9QwzBGjKsE2hxemD2AFs8 1000\n');
  console.log('  yarn api -r "18.222.29.148" balances freeBalance 5H7Jk4UDwZ3JkfbcrX2NprfZYaPJknApeqjiswKJPBPt6LRN\n');
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
  process.exit(1);
}
