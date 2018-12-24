import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { init } from './api';
import { getProposals, getProposalByHash, createProposal } from './api/governance';
const { stringToU8a } = require('@polkadot/util');
const { Keyring } = require('@polkadot/keyring');

class ProposalList extends Component {
  render() {
    var styling = {
      margin: "4px auto",
      display: "table",
    };
    return (
      <div>
        <ol style={styling}>
          {
            this.props.proposals.map(function(proposal, idx) {
              return <li key={idx}>{proposal}</li>;
            })
          }
        </ol>
      </div>
    );
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalValue: '',
      proposals: [],
      apiPending: true,
      api: null
    };
  }

  handleSubmit = async event => {
    // Create an instance of the keyring
    this.keyring = new Keyring();

    const ALICE_SEED = 'Alice'.padEnd(32, ' ');

    // Add Alice to our keyring (with the known seed for the account)
    var alice = this.keyring.addFromSeed(stringToU8a(ALICE_SEED));

    console.log("Submit pressed on proposal: '" + this.state.proposalValue + "'");
    await createProposal(this.state.api, alice, this.state.proposalValue, "Funding");
  };

  handleUpdateProposals = async event => {
      var api = this.state.api;
      var proposalHashes = await getProposals(api);
      var proposals = await Promise.all(proposalHashes.map(function (hash) {
        return getProposalByHash(api, hash);
      }));
      console.log(proposals);
      this.setState({
          proposals: proposals.map(function (proposal) { return proposal.contents })
      });
  };

  updateInputValue = event => {
      this.setState({
          proposalValue: event.target.value
      });
  }

  componentDidMount() {
    init().then(function(api) {
      console.log("API READY");
      this.setState({
        apiPending: false,
        api: api
      })
     }.bind(this))
    .catch(function(err) {
      console.log("API ERROR: ", err);
      this.setState({
        apiPending: true,
        api: null
      })
    }.bind(this));
  }

  render() {
      // TODO: make proposal list work (refresh when api is available and when submit clicked)
    return (
      <div className="App">
        <header />
        <div>Proposal: <input value={this.state.proposalValue} onChange={this.updateInputValue} type="text" name="proposalInput" /></div>
        <div><button onClick={this.handleSubmit} disabled={this.state.apiPending}>Submit</button></div>
        <div><button onClick={this.handleUpdateProposals}  disabled={this.state.apiPending}>Update Proposals</button></div>
        <ProposalList proposals={this.state.proposals} />
      </div>
    );
  }
}

export default App;
