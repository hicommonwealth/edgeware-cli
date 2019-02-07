import { ApiRx, ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { IdentityTypes } from './identity';
import { GovernanceTypes } from './governance';
import { VotingTypes } from './voting';

export async function initApiRx(remoteNodeUrl?: string) {
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
  const api = new ApiRx(options);
  return api;
}

export async function initApiPromise(remoteNodeUrl?: string) {
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
  const api = new ApiPromise(options);
  return api;
}
