import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { IdentityTypes, VariableLengthIdentityTypes } from './identity';
import { GovernanceTypes, VariableLengthGovernanceTypes } from './governance';

export const VariableLengthTypes = [
  ...VariableLengthIdentityTypes,
  ...VariableLengthGovernanceTypes,
];

export default async function (remoteNodeUrl: string) {
  const options = {
    provider : new WsProvider('ws://' + remoteNodeUrl),
    types : {
      ...IdentityTypes,
      ...GovernanceTypes,
    },
  };
  const api = new ApiPromise(options);
  return api;
}
