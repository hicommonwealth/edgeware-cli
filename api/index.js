import { IdentityTypes } from './identity';

export const init = async function() {
  // Create an instance of the keyring
  keyring = new Keyring();

  const ALICE_SEED = 'Alice'.padEnd(32, ' ');

  // Add Alice to our keyring (with the known seed for the account)
  alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));

  // Create our API with a default connection to the local node
  let options = {
      additionalTypes : {
          ...IdentityTypes,
      }
  };

  api = await new ApiPromise(options).isReady;
  console.log(api);
}
