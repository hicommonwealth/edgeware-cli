const { ApiPromise } = require('@polkadot/api');
const { TypeRegistry } = require('@polkadot/types/codec/typeRegistry');
const { u32, Bytes } = require('@polkadot/types');
const { blake2AsU8a } = require('@polkadot/util-crypto');
const { Keyring } = require('@polkadot/keyring');
const { stringToU8a } = require('@polkadot/util');

const { IdentityTypes } = require('../src/identity');
const { GovernanceTypes } = require('../src/governance');
const testingPairs = require('@polkadot/keyring/testingPairs');

describe('Identity', () => {
  var options = {
      types : {
          ...IdentityTypes,
          ...GovernanceTypes,
      }
  };

  it("should get the chain information", async function () {
    let api = await ApiPromise.create(options);
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ]);

    console.log(chain, nodeName, nodeVersion);
  })
});