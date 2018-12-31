import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { compactAddLength, stringToU8a } from "@polkadot/util";

export const stringToBytes = function (s: string) {
  return compactAddLength(stringToU8a(s));
}

export const isQuery = function(api: ApiPromise, mod: string, func: string) {
    return api.query[mod] && api.query[mod][func];
}

export const makeQuery = async function(api: ApiPromise, mod: string, func: string, ...args: string[]) {
    //TODO: marshalling string-type args
    return await api.query[mod][func].apply(api, ...args);
}

export const isTx = function(api: ApiPromise, mod: string, func: string) {
    return api.tx[mod] && api.tx[mod][func];
}

export const makeTx = async function(api: ApiPromise, mod: string, func: string, user: KeyringPair, ...args: string[]) {
    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
        return new Error("Failed to get nonce!");
    }
    //TODO: marshalling string-type args
    const tx = api.tx[mod][func].apply(api, ...args);
    tx.sign(user, txNonce.toU8a());
    const hash = await tx.send();
    return hash;
}
