import fs from 'fs';
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { compactAddLength, stringToU8a } from '@polkadot/util';
import { Type, Metadata } from '@polkadot/types';

export const stringToBytes = (s: string) => {
  return compactAddLength(stringToU8a(s));
};

export interface ITypeSignature {
    arguments: Type[];
    return?: Type;
}

const convertArgs = (args: string[], types: Type[]) => {
    if (args.length !== types.length) {
        return new Error(`incorrect number of arguments. passed: ${args.length}, required: ${types.length}`);
    }
    const resultArgs = [];
    for (const arg of args) {
        const typeName = types.toString();
        if (typeName === 'Bytes' || typeName === 'Text') {
            resultArgs.push(stringToBytes(arg));
        } else {
            resultArgs.push(arg);
        }
    }
    return resultArgs;
};

export const isQuery = (api: ApiPromise, mod: string, func: string) => {
    return api.query[mod] && api.query[mod][func];
};

export const queryType = (api: ApiPromise, mod: string, func: string) => {
    const t = api.query[mod][func].meta.type;
    if (t.isMap) {
        return 'Storage: ' + t.asMap.key.toString() + ' -> ' + t.asMap.value.toString();
    } else {
        return 'Storage: ' + t.asType.toString();
    }
};

export const makeQuery = async (api:  ApiPromise, mod:  string, func: string, args: string[]) => {
    const query = api.query[mod][func];
    const types = query.meta.type.isMap ? [query.meta.type.asMap.key] : [];
    const convertedArgs = convertArgs(args, types);
    if (convertedArgs instanceof Error) {
        return convertedArgs;
    }
    return await query.apply(api, convertedArgs);
};

export const isTx = (api: ApiPromise, mod: string, func: string) => {
    return api.tx[mod] && api.tx[mod][func];
};

export const txType = (api: ApiPromise, mod: string, func: string) => {
    const args = api.tx[mod][func].meta.arguments;
    let result = 'Transaction: (';
    args.forEach((t) => {
        result += t.name + ': ' + t.type + ', ';
    });
    return result + ') -> ()';
};

export const makeTx = async (api:  ApiPromise, mod:  string, func: string, user: KeyringPair, args: string[]) => {
    if (!isTx(api, mod, func)) {
        return new Error(`Tx ${mod}.${func} does not exist!`);
    }
    const txFunc = api.tx[mod][func];

    if (mod === 'upgradeKey' && func === 'upgrade') {
      args = [fs.readFileSync(args[0], "utf8")];
    }

    const convertedArgs = convertArgs(args, txFunc.meta.arguments.map((m) => m.type));
    if (convertedArgs instanceof Error) {
        return convertedArgs;
    }

    console.log(convertedArgs);

    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
        return new Error('Failed to get nonce!');
    }
    const tx = txFunc.apply(api, convertedArgs);
    tx.sign(user, txNonce.toU8a());
    const hash = await tx.send();
    return hash;
};
