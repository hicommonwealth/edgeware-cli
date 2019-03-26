import { Null, AccountId, bool, u64, Balance } from '@polkadot/types';
import { EnumType, Struct, Vector, Tuple, Option } from '@polkadot/types/codec';
import U8aFixed from '@polkadot/types/codec/U8aFixed';
import { AnyU8a } from '@polkadot/types/types';

export class PreVoting extends Null { }
export class Commit extends Null { }
export class Voting extends Null { }
export class Completed extends Null { }

export class VoteStage extends EnumType<PreVoting | Commit | Voting | Completed> {
  constructor (value?: string, index?: number) {
      super({
          prevoting: PreVoting,
          commit: Commit,
          voting: Voting,
          completed: Completed,
    }, value, index);
  }
}

export class Binary extends Null { }
export class MultiOption extends Null { }

export class VoteType extends EnumType<Binary | MultiOption> {
  constructor (value?: string, index?: number) {
    super({
      binary: Binary,
      multioption: MultiOption,
    }, value, index);
  }
}

export class OnePerson extends Null { }
export class OneCoin extends Null { }

export class TallyType extends EnumType<OnePerson | OneCoin> {
  constructor (value?: string, index?: number) {
    super({
      oneperson: OnePerson,
      onecoin: OneCoin,
    }, value, index);
  }
}

export class VoteOutcome extends U8aFixed {
  constructor (value?: AnyU8a) {
    super(value, 256);
  }
}

export class Tally extends Option.with(Vector.with(Tuple.with([Balance, VoteOutcome]))) { }

export class VoteData extends Struct {
  constructor (value: any) {
    super({
      initiator: AccountId,
      stage: VoteStage,
      vote_type: VoteType,
      tally_type: TallyType,
      is_commit_reveal: bool,
    }, value);
  }
  get initiator (): AccountId {
    return this.get('initiator') as AccountId;
  }
  get stage (): VoteStage {
    return this.get('stage') as VoteStage;
  }
  get vote_type (): VoteType {
    return this.get('vote_type') as VoteType;
  }
  get tally_type (): TallyType {
    return this.get('tally_type') as TallyType;
  }
  get is_commit_reveal (): bool {
    return this.get('is_commit_reveal') as bool;
  }
}

export class AccountVotePairs extends Vector.with(Tuple.with([AccountId, VoteOutcome])) { }

export class VoteRecord extends Struct {
  constructor (value: any) {
    super({
      id: u64,
      commitments: AccountVotePairs,
      reveals: AccountVotePairs,
      data: VoteData,
      outcomes: Vector.with(VoteOutcome),
    }, value);
  }
  get id (): u64 {
    return this.get('id') as u64;
  }
  get commitments (): AccountVotePairs {
    return this.get('commits') as AccountVotePairs;
  }
  get reveals (): AccountVotePairs {
    return this.get('reveals') as AccountVotePairs;
  }
  get data () : VoteData {
    return this.get('data') as VoteData;
  }
  get outcomes () : Vector<VoteOutcome> {
    return this.get('outcomes') as Vector<VoteOutcome>;
  }
}

export const VotingTypes = {
  PreVoting,
  Commit,
  Voting,
  Completed,
  VoteStage,
  Binary,
  MultiOption,
  VoteType,
  OnePerson,
  OneCoin,
  TallyType,
  VoteOutcome,
  Tally,
  VoteData,
  VoteRecord,
};
