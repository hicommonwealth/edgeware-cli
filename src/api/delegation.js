// Import the API
const { ApiPromise } = require('@polkadot/api');
const { TypeRegistry } = require('@polkadot/types/codec/typeRegistry')
const { blake2AsU8a } = require('@polkadot/util-crypto')
const { Keyring } = require('@polkadot/keyring');
const { stringToU8a } = require('@polkadot/util');

export const delegateTo = async function (api, user, to) {
    // Retrieve the nonce for the user, to be used to sign the transaction
    const txNonce = await api.query.system.accountNonce(user.address());
    const tx = api.tx.delegation.delegate_to(to);
    tx.sign(user, txNonce);
    const pubHash = await tx.send();
    console.log(`Delegation from ${user} to ${to} with hash ${pubHash}`);
    return pubHash;
}

export const undelegateFrom = async function (api, user, from) {
    // Retrieve the nonce for the user, to be used to sign the transaction
    const txNonce = await api.query.system.accountNonce(user.address());
    const tx = api.tx.delegation.undelegate_from(from);
    tx.sign(user, txNonce);
    const pubHash = await tx.send();
    console.log(`Un-delegation back to ${user} from ${from} with hash ${pubHash}`);
    return pubHash;
}

export const getDelegation = async function (user) {
  return await api.query.delegationStorage.delgeate_of(user);
}
