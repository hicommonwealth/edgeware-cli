import { Bytes, AccountId, Text, u32, Null, Moment } from '@polkadot/types';
import { Option, Struct, EnumType } from '@polkadot/types/codec';

export class MetadataRecord extends Struct {
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

export class Registered extends Null { }
export class Attested extends Null { }
export class Verified extends Null { }

export class IdentityStage extends EnumType<Registered | Attested | Verified> {
  constructor (value?: string, index?: number) {
    super({
      registered: Registered,
      attested: Attested,
      verified: Verified,
    }, value, index);
  }
}

export class IdentityRecord extends Struct {
  constructor (value: any) {
    super({
      account: AccountId,
      identity_type: Text,
      identity: Bytes,
      stage: IdentityStage,
      expiration_time: Moment,
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
  get expiration_time(): Date {
    return Moment.decodeMoment(this.get('expiration_time') as Moment);
  }
  get proof (): Text | null {
    const opt = this.get('proof') as Option<Text>;
    return opt.unwrapOr(null);
  }
  get metadata (): MetadataRecord | null {
    const opt = this.get('metadata') as Option<MetadataRecord>;
    return opt.unwrapOr(null);
  }
}

export const IdentityTypes = {
  IdentityStage,
  IdentityRecord,
  MetadataRecord,
  IdentityType: Text,
  Attestation: Bytes,
  Identity: Bytes,
};
