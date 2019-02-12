import { AccountId, Null, u32, Text, u64, Moment } from '@polkadot/types';
import { EnumType, Struct, Vector, Tuple } from '@polkadot/types/codec';

export class Signaling extends Null { }
export class Funding extends u32 { }
export class Upgrade extends Null { }

export class ProposalCategory extends EnumType<Signaling | Funding | Upgrade> {
  constructor (value?: string, index?: number) {
      super({
          signaling: Signaling,
          funding: Funding,
          upgrade: Upgrade,
    }, value, index);
  }
}

export class PreVoting extends Null { }
export class Voting extends Null { }
export class Completed extends Null { }

export class ProposalStage extends EnumType<PreVoting | Voting | Completed> {
  constructor (value?: string, index?: number) {
    super({
      prevoting: PreVoting,
      voting: Voting,
      completed: Completed,
    }, value, index);
  }
}

export class ProposalComment extends Tuple.with([Text, AccountId]) { }

export class ProposalRecord extends Struct {
  constructor (value: any) {
    super({
      index: u32,
      author: AccountId,
      stage: ProposalStage,
      transition_time: Moment,
      category: ProposalCategory,
      title: Text,
      contents: Text,
      comments: Vector.with(ProposalComment),
      vote_id: u64,
    }, value);
  }
  get index (): u32 {
    return this.get('index') as u32;
  }
  get author (): AccountId {
    return this.get('author') as AccountId;
  }
  get stage (): ProposalStage {
    return this.get('stage') as ProposalStage;
  }
  get transition_time () : Date {
    return Moment.decodeMoment(this.get('transition_time') as Moment);
  }
  get category () : ProposalCategory {
    return this.get('category') as ProposalCategory;
  }
  get title () : Text {
    return this.get('title') as Text;
  }
  get contents () : Text {
    return this.get('contents') as Text;
  }
  get comments () : Vector<ProposalComment> {
    return this.get('comments') as Vector<ProposalComment>;
  }
  get vote_id () : u64 {
    return this.get('vote_id') as u64;
  }
}

export const GovernanceTypes = {
  Signaling,
  Funding,
  Upgrade,
  PreVoting,
  Voting,
  Completed,
  ProposalStage,
  ProposalComment,
  ProposalCategory,
  ProposalRecord,
};
