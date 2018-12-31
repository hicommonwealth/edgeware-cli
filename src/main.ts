#!/usr/bin/env ts-node

import { default as meow } from 'meow';

import Keyring from '@polkadot/keyring';
import stringToU8a from '@polkadot/util/string/toU8a'

import { init } from './index';
import { isQuery, makeQuery, isTx, makeTx } from "./util"

let main = async function(args) {
    let mod = args.input[0];
    let func = args.input[1];
    let funcArgs = args.input.slice(2);
    //console.log(`module: ${mod}, func: ${func}, args: ${funcArgs}`);

    let endpoint = '127.0.0.1:9944';
    if (args.flags.remoteNode) {
        endpoint = args.flags.remoteNode;
        if (endpoint.indexOf(":") === -1) {
            endpoint += ":9944";
        }
        console.log(`Using remote node: ${endpoint}`);
    }
    let api = await init(endpoint);
    //TODO: catch errors

    let storageMod = mod + "Storage";
    if (isQuery(api, storageMod, func)) {
        console.log(`Making query: ${storageMod}.${func}(${funcArgs})`);
        let result = await makeQuery(api, storageMod, func, funcArgs);
        console.log(result.toString());
        //TODO: catch errors
        process.exit(0);
    }

    if (isTx(api, mod, func)) {
        if (!args.flags.seed) {
            console.log("Transactions must provide user (currently via --seed).");
            process.exit(1);
        }
        console.log(`Making tx: ${mod}.${func}(${funcArgs})`);
        const keyring = new Keyring();
        const user = keyring.addFromSeed(stringToU8a(args.flags.seed.padEnd(32, ' ')));
        let result = await makeTx(api, mod, func, user, funcArgs);
        console.log(result.toString());
        //TODO: catch errors
        process.exit(0);
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

    Examples (TODO)
      $ yarn api --seed Alice identity publish www.github.com/drewstone
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
