import { Bytes, AccountId, Text, u32, BlockNumber, Null } from '@polkadot/types';
import { Option, Struct, EnumType } from '@polkadot/types/codec';
import { unwrapOrNull } from './util';

class MetadataRecord extends Struct {
  constructor (value: any) {
    super({
      avatar: Text,
      display_name: Text,
      tagline: Text,
    }, value);
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

class Registered extends Null { }
class Attested extends Null { }
class Verified extends Null { }

// TODO: One thing that bugs me is that console.log()-ing an IdentityStage
//       prints the *value* of the stage (aka the expiration time) rather than
//       the *type*. Unfortunately, I don't know how to fix this. It shouldn't
//       have an impact on functionality, though.
class IdentityStage extends EnumType<Registered | Attested | Verified> {
  constructor (value?: string, index?: number) {
    super({
      Registered,
      Attested,
      Verified,
    }, value, index);
  }
}

class IdentityRecord extends Struct {
  constructor (value: any) {
    super({
      account: AccountId,
      identity: Bytes,
      stage: IdentityStage,
      expiration_time: Option.with(BlockNumber),
      proof: Option.with(Text),
      metadata: Option.with(MetadataRecord),
    }, value);
  }
  get account (): AccountId {
    return this.get('account') as AccountId;
  }
  get identity (): Bytes {
    return this.get('identity') as Bytes;
  }
  get stage (): IdentityStage {
    return this.get('stage') as IdentityStage;
  }
  get expiration_time(): BlockNumber | null {
    const opt = this.get('expiration_time') as Option<BlockNumber>;
    return unwrapOrNull(opt);
  }
  get proof (): Text | null {
    const opt = this.get('proof') as Option<Text>;
    return unwrapOrNull(opt);
  }
  get metadata (): MetadataRecord | null {
    const opt = this.get('metadata') as Option<MetadataRecord>;
    return unwrapOrNull(opt);
  }
}

// Old types that aren't used anymore (kept for backwards compatability)
const ArchivedTypes = {
  IdentityIndex: u32,
};

// Current types
const CurrentTypes = {
  IdentityStage,
  IdentityRecord,
  MetadataRecord,
  Claim: Bytes,
  Attestation: Bytes,
};

export const IdentityTypes = { ...ArchivedTypes, ...CurrentTypes };
export const VariableLengthIdentityTypes = [ 'Claim', 'Attestation' ];
