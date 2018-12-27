import React, { Component } from 'react';
import './App.css';
import { init } from './api';
import { getProposals, getProposalByHash, createProposal } from './api/governance';
import { publish, getAllIdentities, getIdentityByHash } from './api/identity';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';

class ProposalList extends Component {
  render() {
    const styling = {
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

class IdentityList extends Component {
  render() {
    const styling = {
      margin: "4px auto",
      display: "table",
    };
    return (
      <div>
        <ol style={styling}>
          {
            this.props.identities.map(function(identity, idx) {
              return <li key={idx}>{identity}</li>;
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
      proposalTitle: '',
      identitySeed: '',
      identityMsg: '',
      proposals: [],
      identities: [],
      apiPending: true,
      api: null,
      keyring: new Keyring(),
      user: null
    };
  }

  handleSubmit = async event => {
    console.log("Submit pressed on proposal: '" + this.state.proposalValue + "'");
    const res = await createProposal(this.state.api, this.state.user, this.state.proposalTitle, this.state.proposalValue, "Funding");
    console.log("Create proposal result: ", res);
  };

  handleSubmitIdentity = async event => {
    console.log("Submit pressed on identity: " + this.state.identityMsg + " for " + this.state.identitySeed);
    // Auto-pad string out to seed size of 32 char
    const newUser = this.state.keyring.addFromSeed(stringToU8a(this.state.identitySeed.padEnd(32, ' ')));
    const res = await publish(this.state.api, newUser, this.state.identityMsg);
    console.log("Published identity result: ", res);
    this.setState({
      user: newUser
    });
  };

  handleUpdateIdentities = async event => {
    var api = this.state.api;
    var identityHashes = await getAllIdentities(api);
    var identities = await Promise.all(identityHashes.map(function (hash) {
      return getIdentityByHash(api, hash);
    }));
    console.log(identities);
    this.setState({
      identities: identities.map(function (identity) {
        return "" + identity.account;
      })
    });
  };

  handleUpdateProposals = async event => {
      var api = this.state.api;
      var proposalHashes = await getProposals(api);
      var proposals = await Promise.all(proposalHashes.map(function (hash) {
        return getProposalByHash(api, hash);
      }));
      console.log(proposals);
      this.setState({
        proposals: proposals.map(function (proposal) {
          return proposal.title + ": " + proposal.contents
        })
      });
  };

  updateTitleValue = event => {
      this.setState({
          proposalTitle: event.target.value
      });
  }

  updateProposalValue = event => {
    this.setState({
        proposalValue: event.target.value
    });
}

  updateIdentitySeed = event => {
    this.setState({
      identitySeed: event.target.value
    })
  }

  updateIdentityMsg = event => {
    this.setState({
      identityMsg: event.target.value
    })
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
        <div>Seed: <input value={this.state.identitySeed} onChange={this.updateIdentitySeed} type="text" name="seedInput" /></div>
        <div>Identity: <input value={this.state.identityMsg} onChange={this.updateIdentityMsg} type="text" name="identityInput" /></div>
        <div><button onClick={this.handleSubmitIdentity} disabled={this.state.apiPending}>Submit Identity</button></div>
        <div><button onClick={this.handleUpdateIdentities}  disabled={this.state.apiPending}>Update Identities</button></div>
        <IdentityList identities={this.state.identities} />
        <div>Title: <input value={this.state.proposalTitle} onChange={this.updateTitleValue} type="text" name="titleInput" /></div>
        <div>Proposal: <input value={this.state.proposalValue} onChange={this.updateProposalValue} type="text" name="proposalInput" /></div>
        <div><button onClick={this.handleSubmit} disabled={this.state.apiPending}>Submit Proposal</button></div>
        <div><button onClick={this.handleUpdateProposals}  disabled={this.state.apiPending}>Update Proposals</button></div>
        <ProposalList proposals={this.state.proposals} />
      </div>
    );
  }
}

export default App;
