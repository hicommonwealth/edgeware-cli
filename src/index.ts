import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { IdentityTypes } from './identity';
import { GovernanceTypes } from './governance';
import { VotingTypes } from './voting';

export default async function (remoteNodeUrl: string) {
  const options = {
    provider : new WsProvider(remoteNodeUrl),
    types : {
      ...IdentityTypes,
      ...GovernanceTypes,
      ...VotingTypes,
    },
  };
  const api = new ApiPromise(options);
  return api;
}
