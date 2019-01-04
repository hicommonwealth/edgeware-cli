import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { IdentityTypes } from './identity';
import { GovernanceTypes } from './governance';

export default async function (remoteNodeUrl: string) {
  const options = {
    provider : new WsProvider('ws://' + remoteNodeUrl),
    types : {
      ...IdentityTypes,
      ...GovernanceTypes,
    },
  };

  return await ApiPromise.create(options);
}
