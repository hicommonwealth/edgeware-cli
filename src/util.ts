import { ApiPromise, ApiRx } from '@polkadot/api';
import { Type } from '@polkadot/types';

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

export const isDerive = (api: ApiPromise, mod: string, func: string) => {
    return api.derive[mod] && !!api.derive[mod][func];
};

export const deriveType = (api: ApiPromise, mod: string, func: string) => {
    const d = api.derive[mod][func];
    return 'Cannot get types of derive.';
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
