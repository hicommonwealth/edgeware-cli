import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';

export default async function (remoteNodeUrl) {
    const options = {
      provider : new WsProvider('ws://' + remoteNodeUrl),
      types : {
        ...IdentityTypes,
        ...GovernanceTypes,
      },
    };

    return await ApiPromise.create(options);
}
