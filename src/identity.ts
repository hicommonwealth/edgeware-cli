import { ApiPromise } from "@polkadot/api";
import { Bytes, Hash, AccountId, Text } from "@polkadot/types";
import { Option, Struct } from '@polkadot/types/codec';
import { blake2AsU8a } from '@polkadot/util-crypto';
import { KeyringPair } from "@polkadot/keyring/types";
import { stringToBytes } from './util';

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