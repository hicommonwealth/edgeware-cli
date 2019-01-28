import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { IdentityTypes, VariableLengthIdentityTypes } from './identity';
import { GovernanceTypes, VariableLengthGovernanceTypes } from './governance';
import { VotingTypes, VariableLengthVotingTypes } from './voting';

export const VariableLengthTypes = [
  ...VariableLengthIdentityTypes,
  ...VariableLengthGovernanceTypes,
  ...VariableLengthVotingTypes,
];

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
