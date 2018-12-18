// Import the API
const { EnumType } = require('@polkadot/types/codec');
const { Null } = require('@polkadot/types');
const { blake2AsU8a } = require('@polkadot/util-crypto')

class Referendum extends Null { }
class Funding extends Null { }
class NetworkChange extends Null { }

class ProposalCategory extends EnumType<Referendum | Funding | NetworkChange> {
  constructor (value, index) {
      super([
          Referendum,
          Funding,
          NetworkChange
      ], value, index);
  }
}

export const GovernanceTypes = {
    "ProposalCategory": ProposalCategory
};

export const createProposal = async function (api, user, proposal, category) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  console.log("NONCE: ", txNonce);
  const prop = api.tx.governance.createProposal(proposal, category);
  prop.sign(user, txNonce);
  const propHash = await prop.send();
  console.log(`Proposal ${proposal} published with hash ${propHash}`);
  return propHash;
}

export const addComment = async function (api, user, proposalHash, commentText) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  const comment = api.tx.governance.addComment(proposalHash, commentText);
  comment.sign(user, txNonce);
  const commentHash = await comment.send();
  console.log(`Common ${commentText} published with hash ${commentHash}`);
  return commentHash;
}

export const vote = async function (api, user, proposalHash, voteBool) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  const vote_tx = api.tx.governance.vote(proposalHash, voteBool);
  vote_tx.sign(user, txNonce);
  const voteHash = await vote_tx.send();
  console.log(`Vote ${vote} for proposal ${proposalHash} published with hash ${voteHash}`);
  return voteHash;

}

export const getProposals = async function (api) {
  return await api.query.governanceStorage.proposals();
}

export const getProposalCount = async function (api) {
  return await api.query.governanceStorage.proposal_count();
}

export const getProposalByHash = async function (api, proposalHash) {
  return await api.query.governanceStorage.proposal_of(proposalHash);
}

export const getProposal = async function (api, account, proposal) {
  let input = account.concat(proposal);
  let proposalHash = blake2AsU8a(input);
  return await getProposalByHash(api, proposalHash);
}
