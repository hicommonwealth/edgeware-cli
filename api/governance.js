// Import the API
const { u32, Bytes } = require('@polkadot/types');
const { blake2AsU8a } = require('@polkadot/util-crypto')

export const GovernanceTypes = {};

export const createProposal = async function (api, user, proposal, category) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  const prop = api.tx.governance.create_proposal(proposal, category);
  prop.sign(user, txNonce);
  const propHash = await prop.send();
  console.log(`Proposal ${proposal} published with hash ${propHash}`);
  return propHash;
}

export const add_comment = async function (api, user, proposalHash, comment) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  const comment = api.tx.governance.add_comment(proposalHash, comment);
  comment.sign(user, txNonce);
  const commentHash = await comment.send();
  console.log(`Common ${comment} published with hash ${commentHash}`);
  return commentHash;
}

export const vote = async function (api, user, proposalHash, voteBool) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  const vote_tx = api.tx.governance.add_comment(proposalHash, voteBool);
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
