#!/usr/bin/env ts-node
require('dotenv').config();
const fs = require('fs');
const program = require('commander');
const path = require('path');
const version = require('../package.json').version;

import * as EdgewareTypes from '@edgeware/node-types/interfaces/definitions';
import Keyring from '@polkadot/keyring';
import { isHex } from '@polkadot/util';
import { CodecArg } from '@polkadot/types/types';
import { TypeRegistry } from '@polkadot/types';
import { DispatchError } from '@polkadot/types/interfaces';
import { ApiRx, SubmittableResult } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { switchMap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { KeyringPair } from '@polkadot/keyring/types';
import argSwitcher from './argSwitcher';
import { RpcRxResult } from '@polkadot/api/types';

const isQuery = (api: ApiRx, mod: string, func: string) => {
  if (api.query[mod] && !!api.query[mod][func]) {
    return 'query';
  } else if (api.rpc[mod] && !!api.rpc[mod][func]) {
    return 'rpc';
  } else {
    return null;
  }
};

const queryType = (api: ApiRx, mod: string, func: string, isRpc = false) => {
  if (isRpc) {
    return `rpc.${mod}.${func}`;
  }
  const t = api.query[mod][func].creator.meta.type;
  if (t.isMap) {
    return `query.${mod}.${func}: ` + t.asMap.key.toString() + ' -> ' + t.asMap.value.toString();
  } else {
    try {
      return `query.${mod}.${func}: ` + t.asPlain.toString();
    } catch (e) {
      return `query.${mod}.${func}: ${t.asDoubleMap.toString()}`;
    }
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
  const args = api.tx[mod][func].meta.args;
  let result = `tx.${mod}.${func}: (`;
  args.forEach((t) => {
    result += t.name + ': ' + t.type + ', ';
  });
  return result + ') -> ()';
};

function initApiRx(remoteNodeUrl: string, registry: TypeRegistry): ApiRx {
  if (remoteNodeUrl.indexOf('ws://') === -1 && remoteNodeUrl.indexOf('wss://') === -1) {
    // default to secure websocket if none provided
    remoteNodeUrl = `wss://${remoteNodeUrl}`;
  }
  const edgewareTypes = Object.values(EdgewareTypes)
    // .map((v) => v.default)
    .reduce((res, { types }): object => ({ ...res, ...types }), {});
  const provider = new WsProvider(remoteNodeUrl);
  const api = new ApiRx({
    provider,
    types: {
      ...edgewareTypes,
      'voting::VoteType': 'VoteType',
      'voting::TallyType': 'TallyType',
      Address: 'GenericAddress',
      Keys: 'SessionKeys4',
      StakingLedger: 'StakingLedgerTo223',
      Votes: 'VotesTo230',
      ReferendumInfo: 'ReferendumInfoTo239',
      Weight: 'u32',
      OpenTip: 'OpenTipTo225',
    },
    registry,
  });
  return api;
}

const execName = path.basename(process.argv[1]);
program.version(version)
  .name(execName)
  .usage('<module> <function> [ARGS...]')
  .arguments('<mod> <func> [args...]')
  .action(async (mod: string, func: string, args: any[]) => {
    const listing = (func.toLowerCase() === 'list');
    const tailing = !!program.tail;
    const argfile = program.argfile;
    if (argfile) {
      try {
        const filedata = fs.readFileSync(argfile);
        if (mod === 'upgradeKey' && func === 'upgrade') {
          const wasm = argfile.toString('hex');
          args = [`0x${wasm}`];
        } else {
          const jsondata = JSON.parse(filedata.toString('utf8'));
          if (Array.isArray(jsondata)) {
            args = jsondata;
          } else {
            throw new Error('Arg file must be array');
          }
        }
      } catch (e) {
        console.error('Unable to use arg file: ' + e.message);
        process.exit(-1);
      }
    }

    if (typeof program.remoteNode === 'undefined') {
      console.error('Defaulting to local node 127.0.0.1:9944');
      program.remoteNode = 'ws://127.0.0.1:9944';
    } else if (program.remoteNode === 'edgeware') {
      // pick a random node from mainnetX.edgewa.re where X = 1 thru 10
      const nodeNumber = Math.floor((Math.random() * 9) + 1);
      program.remoteNode = `wss://mainnet${nodeNumber}.edgewa.re`;
    }

    const registry = new TypeRegistry();
    const apiObservable = initApiRx(program.remoteNode, registry).isReady;
    apiObservable.pipe(switchMap((api: ApiRx) => {
      // List the available actions then exit
      if (listing) {
        if (api.query[mod]) {
          console.log('\nQueries:');
          for (const key of Object.keys(api.query[mod])) {
            console.log(queryType(api, mod, key));
          }
        }
        if (api.rpc[mod]) {
          console.log('\nRPC Queries:');
          for (const key of Object.keys(api.rpc[mod])) {
            console.log(queryType(api, mod, key, true));
          }
        }
        if (api.tx[mod]) {
          console.log('\nTransactions:');
          for (const key of Object.keys(api.tx[mod])) {
            console.log(txType(api, mod, key));
          }
        }
        if (!api.tx[mod] && !api.query[mod] && !api.rpc[mod]) {
          console.error(`No module ${mod} found.`);
          process.exit(1);
        } else {
          process.exit(0);
        }
      }
      const qType = isQuery(api, mod, func);
      if (qType) {
        if (program.types) {
          console.log(queryType(api, mod, func, qType === 'rpc'));
          process.exit(0);
        }

        console.log(`Making query: ${mod}.${func}(${JSON.stringify(args)})`);
        const cArgs: CodecArg[] = args;
        return combineLatest(
          of(true),
          (qType === 'rpc' ? api.rpc : api.query)[mod][func](...cArgs)
        );
      }

      if (isDerive(api, mod, func)) {
        if (program.types) {
          console.log(deriveType(api, mod, func));
          process.exit(0);
        }
        console.log(`Making query: ${mod}.${func}(${JSON.stringify(args)})`);
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

        let pair: KeyringPair;
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

        console.log(`${pair.address} making tx: ${mod}.${func}(${JSON.stringify(args)})`);
        let cArgs: CodecArg[] = args;
        // Switch args into proper formats
        // TODO: Update once Edgeware gets chain ID
        cArgs = argSwitcher(mod, func, cArgs);
        console.log(cArgs);
        return combineLatest(of(false), api.tx[mod][func](...cArgs).signAndSend(pair));
      }
      throw new Error('No action found.');
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
        if (result.status.type === 'Finalized') {
          console.log('Completed at block hash', result.status.value.toHex());
          console.log('Events:');
          result.events.forEach(({ phase, event: { data, method, section } }) => {
            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
            if (section === 'system') {
              if (method === 'ExtrinsicSuccess') {
                console.log('Confirmed!');
              } else if (method === 'ExtrinsicFailed') {
                console.log('Failed!');
                const errorData = data[0] as DispatchError;
                if (errorData.isModule) {
                  const errorInfo = registry.findMetaError(errorData.asModule.toU8a());
                  console.error(`${errorInfo.section}::${errorInfo.name}: ${errorInfo.documentation[0]}`);
                }
              }
            }
          });
          process.exit(0);
        }
      }
    }, (err) => {
      console.log('Failed: ', err);
      process.exit(1);
    });
  })
  .option('-A, --argfile <file>', 'A JSON-formatted file containing an array of args')
  .option('-s, --seed <hexSeed>', 'A seed for signing transactions')
  .option('-r, --remoteNode <url>', 'Remote node url (default: "ws://localhost:9944").')
  .option('-T, --types', 'Print types instead of performing action.')
  .option('-t, --tail', 'Tail output rather than exiting immediately.');

program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log(`  ${execName} --seed //Alice identity register github drewstone\n`);
  console.log(`  ${execName} --seed //Alice balances transfer 5CyT7JeJnCSwXopxPRWM1o3rLXz6WDisq1mkqX4eq7SSzLKX 1000\n`);
  console.log(`  ${execName} -r ws://testnet1.edgewa.re:9944 balances freeBalance `
              + `5CyT7JeJnCSwXopxPRWM1o3rLXz6WDisq1mkqX4eq7SSzLKX\n`);
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
  process.exit(1);
}
