const { ApiPromise } = require('@polkadot/api');
const { TypeRegistry } = require('@polkadot/types/codec/typeRegistry')
const { u32, Bytes } = require('@polkadot/types');
const { blake2AsU8a } = require('@polkadot/util-crypto')
const { Keyring } = require('@polkadot/keyring');
const { stringToU8a } = require('@polkadot/util');