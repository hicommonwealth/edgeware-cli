import { ApiPromise } from "@polkadot/api";
import { u32, Bytes, Hash } from '@polkadot/types';
import { blake2AsU8a } from '@polkadot/util-crypto';
import { KeyringPair } from "@polkadot/keyring/types";

export const IdentityTypes = {
  "Claim": Bytes,
  "IdentityIndex" : u32,
};

export const link = async function (api: ApiPromise, user: KeyringPair, identity: Hash, proof: Bytes) {
    // Retrieve the nonce for the user, to be used to sign the transaction
    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
      console.log("Failed to get nonce!");
      return null;
    }

    let identityHash = blake2AsU8a(identity);
    const link = api.tx.identity.link(identityHash, proof);
    link.sign(user, txNonce.toU8a());
    const linkHash = await link.send();
    console.log(`Identity ${identity} published with hash ${linkHash}`);
    return linkHash;
}

export const publish = async function (api: ApiPromise, user: KeyringPair, identity: Hash) {
    // Retrieve the nonce for Alice, to be used to sign the transaction
    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
      console.log("Failed to get nonce!");
      return null;
    }

    let identityHash = blake2AsU8a(identity);
    const publish = api.tx.identity.publish(identityHash);
    publish.sign(user, txNonce.toU8a());
    const pubHash = await publish.send();
    console.log(`Identity ${identity} published with hash ${pubHash}`);
    return pubHash;
}

export const getAllIdentities = async function (api: ApiPromise) {
  return await api.query.identityStorage.identities();
}

export const getIdentity = async function (api: ApiPromise, identity: Hash) {
  let identityHash = blake2AsU8a(identity);
  return await api.query.identityStorage.identity_of(identityHash);
}

export const getIdentityByHash = async function (api: ApiPromise, identityHash: Hash) {
  return await api.query.identityStorage.identity_of(identityHash);
}

export const getIdentityCount = async function (api: ApiPromise) {
  return await api.query.identityStorage.identityCount();
}

export const getLinkedIdentityCount = async function (api: ApiPromise) {
  return await api.query.identityStorage.linkedIdentityCount();
}

export const getClaim = async function (api: ApiPromise, claimHash: Hash) {
  return await api.query.identityStorage.claims(claimHash);
}

export const getClaimsIssuers = async function (api: ApiPromise) {
  return await api.query.identityStorage.claimsIssuers();
}
