import { ApiPromise } from '@polkadot/api';
import { TypeRegistry } from '@polkadot/types/codec/typeRegistry';
import { u32, Bytes } from '@polkadot/types';
import { blake2AsU8a } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';

import testingPairs from '@polkadot/keyring/testingPairs';

describe('Identity', () => {
  let api;

  before(async () => {
    api = await ApiPromise.create();
  });

  it("should get the chain information", async function () {
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ]);

    console.log(chain, nodeName, nodeVersion);
  })
});