#!/usr/bin/env ts-node

import { default as meow } from 'meow';

import Keyring from '@polkadot/keyring';
import stringToU8a from '@polkadot/util/string/toU8a'

import { init } from './index';
import { isQuery, makeQuery, isTx, makeTx, queryType, txType } from "./util"

let main = async function(args) {
    const seed = args.flags.seed;
    const printTypes = args.flags.types;
    const mod = args.input[0];
    const func = args.input[1];
    const funcArgs = args.input.slice(2);
    let endpoint = '127.0.0.1:9944';
    if (args.flags.remoteNode) {
        endpoint = args.flags.remoteNode;
        if (endpoint.indexOf(":") === -1) {
            endpoint += ":9944";
        }
        console.log(`Using remote node: ${endpoint}`);
    }
    const api = await init(endpoint);

    const storageMod = mod + "Storage";
    if (isQuery(api, storageMod, func)) {
        if (printTypes) {
            console.log(queryType(api, storageMod, func));
            process.exit(0);
        }
        console.log(`Making query: ${storageMod}.${func}(${funcArgs})`);
        try {
            const result = await makeQuery(api, storageMod, func, funcArgs);
            console.log(result.toString());
            process.exit(0);
        } catch (err) {
            console.log("Failed: ", err);
            process.exit(1);
        }
    }

    if (isTx(api, mod, func)) {
        if (printTypes) {
            console.log(txType(api, mod, func));
            process.exit(0);
        }
        if (!seed) {
            console.log("Transactions must provide user (currently via --seed).");
            process.exit(1);
        }
        console.log(`Making tx: ${mod}.${func}(${funcArgs})`);
        const keyring = new Keyring();
        const user = keyring.addFromSeed(stringToU8a(seed.padEnd(32, ' ')));
        try {
            const result = await makeTx(api, mod, func, user, funcArgs);
            console.log(result.toString());
            process.exit(0);
        } catch (err) {
            console.log("Failed: ", err);
            process.exit(1);
        }

    }

    console.log("Edgeware function not found.");
    process.exit(1);
}

let args = meow(`
    Usage
      $ yarn api <module> <function> [ARGS]...

    Options
      --remote-node, -r  Remote node url (default: 'localhost:9944').
      --seed, -s         User seed, required for transactions.
      --types, -t        Print types instead of performing action.

    Examples (TODO)
      $ yarn api --seed Alice identity publish 'www.github.com/drewstone'
`, {
    flags: {
        seed: {
            type: 'string',
            alias: 's'
        },
        "remote-node": {
            type: 'string',
            alias: 'r'
        },
        "types": {
            type: 'boolean',
            alias: 't'
        },
        help: {
            type: 'boolean',
            alias: 'h'
        },
        version: {
            type: 'boolean',
            alias: 'v'
        }
    }
});

main(args);
