import { AccountId, Null, u32, Text, BlockNumber, u64 } from '@polkadot/types';
import { EnumType, Struct, Vector, Tuple, Option } from '@polkadot/types/codec';
import { unwrapOrNull } from './util';

class Signaling extends Null { }
class Funding extends Null { }
class Upgrade extends Null { }

class ProposalCategory extends EnumType<Signaling | Funding | Upgrade> {
  constructor (value?: string, index?: number) {
      super({
          Signaling,
          Funding,
          Upgrade,
    }, value, index);
  }
}

class PreVoting extends Null { }
class Voting extends Null { }
class Completed extends Null { }

class ProposalStage extends EnumType<PreVoting | Voting | Completed> {
  constructor (value?: string, index?: number) {
    super({
      PreVoting,
      Voting,
      Completed,
    }, value, index);
  }
}

class ProposalComment extends Tuple.with([Text, AccountId]) { }

class ProposalRecord extends Struct {
  constructor (value: any) {
    super({
      index: u32,
      author: AccountId,
      stage: ProposalStage,
      category: ProposalCategory,
      transition_block: Option.with(BlockNumber),
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
  get category () : ProposalCategory {
    return this.get('category') as ProposalCategory;
  }
  get transition_block () : BlockNumber | null {
    const opt = this.get('transition_block') as Option<BlockNumber>;
    return unwrapOrNull(opt);
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
export const VariableLengthGovernanceTypes : string[] = [ ];
