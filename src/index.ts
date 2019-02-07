import { ApiRx } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { IdentityTypes } from './identity';
import { GovernanceTypes } from './governance';
import { VotingTypes } from './voting';

export default async function (remoteNodeUrl?: string) {
  if (!remoteNodeUrl) {
    remoteNodeUrl = 'ws://localhost:9944';
  }
  const options = {
    provider : new WsProvider(remoteNodeUrl),
    types : {
      ...IdentityTypes,
      ...GovernanceTypes,
      ...VotingTypes,
    },
  };
  const api = ApiRx.create(options).toPromise();
  return api;
}
