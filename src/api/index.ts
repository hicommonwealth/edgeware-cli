import { IdentityTypes } from './identity';
import { GovernanceTypes } from './governance'
import { ApiPromise } from '@polkadot/api';

export const init = async function() {
  // Create our API with a default connection to the local node
  var options = {
      types : {
          ...IdentityTypes,
          ...GovernanceTypes,
      }
  };

  var api = await ApiPromise.create(options);

  return api;
}