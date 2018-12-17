// Import the API
const { u32, Bytes } = require('@polkadot/types');
const { blake2AsU8a } = require('@polkadot/util-crypto')

export const IdentityTypes = {
  "Claim": Bytes,
  "IdentityIndex" : u32,
};

export const link = async function (api, user, identity, proof) {
    // Retrieve the nonce for the user, to be used to sign the transaction
    const txNonce = await api.query.system.accountNonce(user.address());
    let identityHash = blake2AsU8a(identity);
    const link = api.tx.identity.link(identityHash, proof);
    link.sign(user, txNonce);
    const linkHash = await link.send();
    console.log(`Identity ${identity} published with hash ${linkHash}`);
    return linkHash;
}

export const publish = async function (api, user, identity) {
    // Retrieve the nonce for Alice, to be used to sign the transaction
    const txNonce = await api.query.system.accountNonce(user.address());
    let identityHash = blake2AsU8a(identity);
    const publish = api.tx.identity.publish(identityHash);
    publish.sign(user, txNonce);
    const pubHash = await publish.send();
    console.log(`Identity ${identity} published with hash ${pubHash}`);
    return pubHash;
}

export const getAllIdentities = async function (api) {
  return await api.query.identityStorage.identities();
}

export const getIdentity = async function (api, identity) {
  let identityHash = blake2AsU8a(identity);
  return await api.query.identityStorage.identity_of(identityHash);
}

export const getIdentityByHash = async function (api, identityHash) {
  return await api.query.identityStorage.identity_of(identityHash);
}

export const getIdentityCount = async function (api) {
  return await api.query.identityStorage.identity_count();
}

export const getLinkedIdentityCount = async function (api) {
  return await api.query.identityStorage.linked_count();
}

export const getClaim = async function (api, claimHash) {
  return await api.query.identityStorage.claims();
}

export const getClaimsIssuers = async function (api) {
  return await api.query.identityStorage.claims_issuers();
}
