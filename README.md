# edgeware-cli

The edgeware CLI easily allows you to interact with a local or remote Edgeware node or any general substrate node. The api requires you to create a `.env` file with your keypair information, which will be described below.

## Configuration
Create a `.env` file with the following information:
```
MNEMONIC_PHRASE=...
DERIVATION_PATH=...
```
Examples of some values are:
```
MNEMONIC_PHRASE="bottom drive obey lake curtain smoke basket hold race lonely fit walk"
DERIVATION_PATH=//Alice
```

## Usage
1. Install the node modules with `yarn` or `npm`
2. If you want to send transactions, have the hex format of a key ready.
3. Call `yarn api <module> <func> [...args]` with the desired module function and args.

## Options
```

Options:
  -V, --version           output the version number
  -s, --seed <key>        Public/private keypair seed
  -r, --remoteNode <url>  Remote node url (default: "localhost:9944").
  -T, --types             Print types instead of performing action.
  -t, --tail              Tail output rather than exiting immediately.
  -h, --help              output usage information
```

## Examples
- Transfering tokens from one's balance
```
yarn api balances transfer 5FmE1Adpwp1bT1oY95w59RiSPVu9QwzBGjKsE2hxemD2AFs8 1000
```

- Fetching an account balance from the Edgeware Testnet
```
yarn api -r edgeware balances freeBalance 5H7Jk4UDwZ3JkfbcrX2NprfZYaPJknApeqjiswKJPBPt6LRN
```

- Registering an identity
```
yarn api identity register github drewstone
```
