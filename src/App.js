import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { init } from './api';
import { getProposals, createProposal } from './api/governance';
const { stringToU8a } = require('@polkadot/util');
const { Keyring } = require('@polkadot/keyring');

class ProposalList extends Component {
  render() {
    return (
      <div>
        <ul>
          {
            this.props.proposals.map(function(hash) {
              return <li>{hash}</li>;
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
    init().then(function(api) { this.api = api }.bind(this));
  }

  handleSubmit = async event => {
    // Create an instance of the keyring
    this.keyring = new Keyring();

    const ALICE_SEED = 'Alice'.padEnd(32, ' ');
  
    // Add Alice to our keyring (with the known seed for the account)
    var alice = this.keyring.addFromSeed(stringToU8a(ALICE_SEED));

    console.log("Submit pressed on proposal: '" + this.state.proposalValue + "'");
    //createProposal(api, this.alice, this.state.proposalValue, "Funding");
    console.log(await this.api.query.system.accountNonce(alice.address()));
  };

  handleUpdateProposals = async event => {
      var proposals = await getProposals(this.api);
      console.log(proposals);
      this.setState({
          proposals: proposals
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
