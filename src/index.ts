import { IdentityTypes } from './identity';
import { GovernanceTypes } from './governance'
import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';

export const init = async function(ws_endpoint = '127.0.0.1:9944') {
  // Create our API with a default connection to the local node
  var options = {
      types : {
          ...IdentityTypes,
          ...GovernanceTypes,
      },
      provider : new WsProvider("ws://" + ws_endpoint),
  };

  return ApiPromise.create(options);
}
