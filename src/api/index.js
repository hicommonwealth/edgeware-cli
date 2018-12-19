import { IdentityTypes } from './identity';
import { GovernanceTypes } from './governance'
const { Bytes, AccountId } = require('@polkadot/types');
const { ApiPromise } = require('@polkadot/api');

export const init = async function() {
  // Create our API with a default connection to the local node
  var options = {
      additionalTypes : {
          ...IdentityTypes,
          ...GovernanceTypes,
      }
  };

  var api = await ApiPromise.create(options);

  return api;
}
