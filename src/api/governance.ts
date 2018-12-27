import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { Hash, AccountId, Null, u32, Text } from "@polkadot/types";
import { EnumType, Struct, Vector, Tuple } from '@polkadot/types/codec';
import { blake2AsU8a } from '@polkadot/util-crypto';
import { u8aConcat } from '@polkadot/util';

class Signaling extends Null { }

class Funding extends u32 { }

class Upgrade extends Null { }

class ProposalCategory extends EnumType<Signaling | Funding | Upgrade> {
  constructor (value?: string, index?: number) {
      super({
          Signaling,
          Funding,
          Upgrade
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
      Completed
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
      title: Text,
      contents: Text,
      comments: Vector.with(ProposalComment)
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
  get title () : Text {
    return this.get('title') as Text;
  }
  get contents () : Text {
    return this.get('contents') as Text;
  }
  get comments () : Vector<ProposalComment> {
    return this.get('comments') as Vector<ProposalComment>;
  }
}

export const GovernanceTypes = {
    "ProposalCategory": ProposalCategory,
    "ProposalRecord": ProposalRecord
};

export const createProposal =
async function (api: ApiPromise, user: KeyringPair, title: string, proposal: string, category: ProposalCategory) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  if (!txNonce) {
    return new Error("Failed to get nonce!");
  }

  const prop = api.tx.governance.createProposal(title, proposal, category);
  prop.sign(user, txNonce.toU8a());
  const propHash = await prop.send();
  console.log(`Proposal ${title} published with hash ${propHash}`);
  return propHash;
}

export const addComment =
async function (api: ApiPromise, user: KeyringPair, proposalHash: Hash, commentText: string) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  if (!txNonce) {
    return new Error("Failed to get nonce!");
  }

  const comment = api.tx.governance.addComment(proposalHash, commentText);
  comment.sign(user, txNonce.toU8a());
  const commentHash = await comment.send();
  console.log(`Common ${commentText} published with hash ${commentHash}`);
  return commentHash;
}

export const vote =
async function (api: ApiPromise, user: KeyringPair, proposalHash: Hash, voteBool: boolean) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  if (!txNonce) {
    return new Error("Failed to get nonce!");
  }

  const vote_tx = api.tx.governance.submit_vote(proposalHash, voteBool);
  vote_tx.sign(user, txNonce.toU8a());
  const voteHash = await vote_tx.send();
  console.log(`Vote ${voteBool} for proposal ${proposalHash} published with hash ${voteHash}`);
  return voteHash;

}

export const getProposals = async function (api: ApiPromise) {
  return await api.query.governanceStorage.proposals();
}

export const getProposalCount = async function (api: ApiPromise) {
  return await api.query.governanceStorage.proposalCount();
}

export const getProposalByHash = async function (api: ApiPromise, proposalHash: Hash) {
  return await api.query.governanceStorage.proposalOf(proposalHash);
}

export const getProposal = async function (api: ApiPromise, account: AccountId, proposal: string) {
  let input = u8aConcat(account, proposal);
  let proposalHash = new Hash(blake2AsU8a(input));
  return await getProposalByHash(api, proposalHash);
}

export const getProposalVoters = async function (api: ApiPromise, proposalHash: Hash) {
  return await api.query.governanceStorage.proposalVoters(proposalHash);
}

export const getVoteByAccount = async function (api: ApiPromise, proposalHash: Hash, account: AccountId) {
  return await api.query.governanceStorage.voteOf([proposalHash, account]);
}