import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { Type } from '@polkadot/types';
import { Option } from '@polkadot/types/codec';
import { Codec } from '@polkadot/types/types';

export function unwrapOrNull<T extends Codec>(opt: Option<T>) : T | null {
    if (opt.isNone) {
        return null;
    } else {
        return opt.unwrap();
    }
}
export interface ITypeSignature {
    arguments: Type[];
    return?: Type;
}

export const isQuery = (api: ApiPromise, mod: string, func: string) => {
    return api.query[mod] && !!api.query[mod][func];
};

export const queryType = (api: ApiPromise, mod: string, func: string) => {
    const t = api.query[mod][func].meta.type;
    if (t.isMap) {
        return `query.${mod}.${func}: ` + t.asMap.key.toString() + ' -> ' + t.asMap.value.toString();
    } else {
        return `query.${mod}.${func}: ` + t.asType.toString();
    }
};

export const makeQuery = async (api:  ApiPromise, mod:  string, func: string, args: Array<string | object>) => {
    const query = api.query[mod][func];
    return await query(...args);
};

export const isTx = (api: ApiPromise, mod: string, func: string) => {
    return api.tx[mod] && api.tx[mod][func];
};

export const txType = (api: ApiPromise, mod: string, func: string) => {
    const args = api.tx[mod][func].meta.arguments;
    let result = `tx.${mod}.${func}: (`;
    args.forEach((t) => {
        result += t.name + ': ' + t.type + ', ';
    });
    return result + ') -> ()';
};

export const makeTx = async (
    api: ApiPromise,
    mod: string,
    func: string,
    user: KeyringPair,
    args: Array<string | object>,
) => {
    if (!isTx(api, mod, func)) {
        return new Error(`Tx ${mod}.${func} does not exist!`);
    }
    const txFunc = api.tx[mod][func];
    const tx = txFunc(...args);
    // TODO: expose events as per https://polkadot.js.org/api/examples/promise/09_transfer_events/
    const hash = await tx.signAndSend(user);
    return hash;
};
