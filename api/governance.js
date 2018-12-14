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

export const add_comment(api, user, proposalHash, comment) {
  // Retrieve the nonce for the user, to be used to sign the transaction
  const txNonce = await api.query.system.accountNonce(user.address());
  const comment = api.tx.governance.add_comment(proposalHash, comment);
  comment.sign(user, txNonce);
  const commentHash = await comment.send();
  console.log(`Common ${comment} published with hash ${commentHash}`);
  return commentHash;
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

