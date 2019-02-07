import { ApiPromise, ApiRx } from '@polkadot/api';
import { Type } from '@polkadot/types';

export interface ITypeSignature {
    arguments: Type[];
    return?: Type;
}

export const isQuery = (api: ApiRx, mod: string, func: string) => {
    return api.query[mod] && !!api.query[mod][func];
};

export const queryType = (api: ApiRx, mod: string, func: string) => {
    const t = api.query[mod][func].meta.type;
    if (t.isMap) {
        return `query.${mod}.${func}: ` + t.asMap.key.toString() + ' -> ' + t.asMap.value.toString();
    } else {
        return `query.${mod}.${func}: ` + t.asType.toString();
    }
};

export const isTx = (api: ApiRx, mod: string, func: string) => {
    return api.tx[mod] && api.tx[mod][func];
};

export const txType = (api: ApiRx, mod: string, func: string) => {
    const args = api.tx[mod][func].meta.arguments;
    let result = `tx.${mod}.${func}: (`;
    args.forEach((t) => {
        result += t.name + ': ' + t.type + ', ';
    });
    return result + ') -> ()';
};
