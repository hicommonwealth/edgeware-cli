import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { init } from './api';
import { getProposals, getProposalByHash, createProposal } from './api/governance';
const { stringToU8a } = require('@polkadot/util');
const { Keyring } = require('@polkadot/keyring');

class ProposalList extends Component {
  render() {
    return (
      <div>
        <ul>
          {
            this.props.proposals.map(function(proposal, idx) {
              return <li>{idx}: {proposal}</li>;
            })
          }
        </ul>
      </div>
    );
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalValue: '',
      proposals: []
    };

    this.api = null;
    init().then(function(api) { this.api = api; console.log("API READY") }.bind(this));
  }

  handleSubmit = async event => {
    // Create an instance of the keyring
    this.keyring = new Keyring();

    const ALICE_SEED = 'Alice'.padEnd(32, ' ');

    // Add Alice to our keyring (with the known seed for the account)
    var alice = this.keyring.addFromSeed(stringToU8a(ALICE_SEED));

    console.log("Submit pressed on proposal: '" + this.state.proposalValue + "'");
    await createProposal(this.api, alice, this.state.proposalValue, "Funding");
    // console.log(await this.api.query.system.accountNonce(alice.address()));
  };

  handleUpdateProposals = async event => {
      var api = this.api;
      var proposalHashes = await getProposals(api);
      var proposals = await Promise.all(proposalHashes.map(function (hash) {
        return getProposalByHash(api, hash);
      }));
      console.log(proposals);
      this.setState({
          proposals: proposals.map(function (proposal) { return proposal.contents })
      });
  };

  updateInputValue(evt) {
      this.setState({
          proposalValue: evt.target.value
      });
  }

  render() {
      // TODO: make proposal list work (refresh when api is available and when submit clicked)
    return (
      <div className="App">
        <header />
        <div>Proposal: <input value={this.state.proposalValue} onChange={evt => this.updateInputValue(evt)} type="text" name="proposalInput" /></div>
        <div><button onClick={this.handleSubmit}>Submit</button></div>
        <div><button onClick={this.handleUpdateProposals}>Update Proposals</button></div>
        <ProposalList proposals={this.state.proposals} />
      </div>
    );
  }
}

export default App;
