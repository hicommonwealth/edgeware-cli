import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { compactAddLength, stringToU8a } from "@polkadot/util";
import { Type, Metadata } from "@polkadot/types";

export const stringToBytes = function(s: string) {
  return compactAddLength(stringToU8a(s));
}

const convertArgs = function(args: string[], types: Type[]) {
    if (args.length != types.length) {
        return new Error(`incorrect number of arguments. passed: ${args.length}, required: ${types.length}`);
    }
    let resultArgs = [];
    for (let i = 0; i < args.length; ++i) {
        let arg = args[i];
        let typeName = types.toString();
        if (typeName === "Bytes" || typeName === "Text") {
            resultArgs.push(stringToBytes(arg));
        } else {
            resultArgs.push(arg);
        }
    }
    return resultArgs;
}

export const isQuery = function(api: ApiPromise, mod: string, func: string) {
    return api.query[mod] && api.query[mod][func];
}

export const makeQuery = async function(api:  ApiPromise,
                                        mod:  string,
                                        func: string,
                                        args: string[]) {
    if (!isQuery(api, mod, func)) {
        return new Error(`Query ${mod}.${func} does not exist!`);
    }
    let query = api.query[mod][func];
    let types = query.meta.type.isMap ? [query.meta.type.asMap.key] : [];
    let convertedArgs = convertArgs(args, types);
    if (convertedArgs instanceof Error) {
        return convertedArgs;
    }
    return await query.apply(api, convertedArgs);
}

export const isTx = function(api: ApiPromise, mod: string, func: string) {
    return api.tx[mod] && api.tx[mod][func];
}

export const makeTx = async function(api:  ApiPromise,
                                     mod:  string,
                                     func: string,
                                     user: KeyringPair,
                                     args: string[]) {
    if (!isTx(api, mod, func)) {
        return new Error(`Tx ${mod}.${func} does not exist!`);
    }
    let txFunc = api.tx[mod][func];
    let convertedArgs = convertArgs(args, txFunc.meta.arguments.map((m) => m.type));
    if (convertedArgs instanceof Error) {
        return convertedArgs;
    }

    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
        return new Error("Failed to get nonce!");
    }
    const tx = txFunc.apply(api, convertedArgs);
    tx.sign(user, txNonce.toU8a());
    const hash = await tx.send();
    return hash;
}
