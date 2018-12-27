import { ApiPromise } from "@polkadot/api";
import { Bytes, Hash, AccountId, u32, Text } from "@polkadot/types";
import { Option, Struct } from '@polkadot/types/codec';
import { blake2AsU8a } from '@polkadot/util-crypto';
import { KeyringPair } from "@polkadot/keyring/types";

class MetadataRecord extends Struct {
  constructor (value: any) {
    super({
      avatar: Text,
      display_name: Text,
      tagline: Text
    }, value)
  }
  get avatar (): Text {
    return this.get('avatar') as Text;
  }
  get display_name (): Text {
    return this.get('display_name') as Text;
  }
  get tagline (): Text {
    return this.get('tagline') as Text;
  }
}

class IdentityRecord extends Struct {
  constructor (value: any) {
    super({
      account: AccountId,
      attestation: Bytes,
      proof: Option.with(Text),
      metadata: Option.with(MetadataRecord)
    }, value)
  }
  get account (): AccountId {
    return this.get('account') as AccountId;
  }
  get attestation (): Bytes {
    return this.get('attestation') as Bytes;
  }
  get proof (): Text | null {
    var p = this.get('proof') as Option<Text>;
    if (p.isNone) {
      return null;
    } else {
      return p.unwrap();
    }
  }
  get metadata (): MetadataRecord | null {
    var mdOpt = this.get('metadata') as Option<MetadataRecord>;
    if (mdOpt.isNone) {
      return null;
    } else {
      return mdOpt.unwrap();
    }
  }
}

export const IdentityTypes = {
  "Claim": Bytes,
  "IdentityRecord": IdentityRecord,
  "MetadataRecord": MetadataRecord
};

export const publish = async function (api: ApiPromise, user: KeyringPair, attestation: string) {
    // Retrieve the nonce for Alice, to be used to sign the transaction
    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
      return new Error("Failed to get nonce!");
    }

    const publish = api.tx.identity.publish(attestation);
    publish.sign(user, txNonce.toU8a());
    const pubHash = await publish.send();
    console.log(`Identity ${attestation} published with tx hash ${pubHash}`);
    return pubHash;
}

export const link = async function (api: ApiPromise, user: KeyringPair, identity: Hash, proof: string) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  if (!txNonce) {
    return new Error("Failed to get nonce!");
  }

  let identityHash = blake2AsU8a(identity);
  const link = api.tx.identity.link(identityHash, proof);
  link.sign(user, txNonce.toU8a());
  const linkHash = await link.send();
  console.log(`Identity ${identity} published with hash ${linkHash}`);
  return linkHash;
}

export const getAllIdentities = async function (api: ApiPromise) {
  return await api.query.identityStorage.identities();
}

export const getIdentity = async function (api: ApiPromise, identity: Hash) {
  let identityHash = blake2AsU8a(identity);
  return await api.query.identityStorage.identityOf(identityHash);
}

export const getIdentityByHash = async function (api: ApiPromise, identityHash: Hash) {
  return await api.query.identityStorage.identityOf(identityHash);
}

export const getClaim = async function (api: ApiPromise, claimHash: Hash) {
  return await api.query.identityStorage.claims(claimHash);
}

export const getClaimsIssuers = async function (api: ApiPromise) {
  return await api.query.identityStorage.claimsIssuers();
}
