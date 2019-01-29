import { Null, AccountId, bool, u64, Balance } from '@polkadot/types';
import { EnumType, Struct, Vector, Tuple, Option } from '@polkadot/types/codec';
import U8aFixed from '@polkadot/types/codec/U8aFixed';
import { AnyU8a } from '@polkadot/types/types';

class PreVoting extends Null { }
class Commit extends Null { }
class Voting extends Null { }
class Completed extends Null { }

class VoteStage extends EnumType<PreVoting | Commit | Voting | Completed> {
  constructor (value?: string, index?: number) {
      super({
          prevoting: PreVoting,
          commit: Commit,
          voting: Voting,
          completed: Completed,
    }, value, index);
  }
}

class Binary extends Null { }
class MultiOption extends Null { }
class AnonymousRing extends Null { }
class AnonymousMerkle extends Null { }

class VoteType extends EnumType<Binary | MultiOption | AnonymousRing | AnonymousMerkle> {
  constructor (value?: string, index?: number) {
    super({
      binary: Binary,
      multioption: MultiOption,
      anonymousring: AnonymousRing,
      anonymousmerkle: AnonymousMerkle,
    }, value, index);
  }
}

class OnePerson extends Null { }
class OneCoin extends Null { }

class TallyType extends EnumType<OnePerson | OneCoin> {
  constructor (value?: string, index?: number) {
    super({
      oneperson: OnePerson,
      onecoin: OneCoin,
    }, value, index);
  }
}

class VoteOutcome extends U8aFixed {
  constructor (value?: AnyU8a) {
    super(value, 256);
  }
}

class Tally extends Option.with(Vector.with(Tuple.with([Balance, VoteOutcome]))) { }

class VoteData extends Struct {
  constructor (value: any) {
    super({
      initiator: AccountId,
      stage: VoteStage,
      vote_type: VoteType,
      tally_type: TallyType,
      is_commit_reveal: bool,
    }, value);
  }
}

class AccountVotePairs extends Vector.with(Tuple.with([AccountId, VoteOutcome])) { }

class VoteRecord extends Struct {
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
  AnonymousRing,
  AnonymousMerkle,
  VoteType,
  OnePerson,
  OneCoin,
  TallyType,
  VoteOutcome,
  Tally,
  VoteData,
  VoteRecord,
};
