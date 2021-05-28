# raw-tx-splitter (Raw/Serialized Bitcoin Transaction Splitter)
![npm](https://img.shields.io/npm/v/raw-tx-splitter)

Single class library that parses and splits out the component fragments of a serialized bitcoin transaction into a TypeScript / JavaScript class. This allows developers to quickly access relevant sections of transaction. The attributes of the class (SerializedTransaction) are kept as serialized strings with each attribute name denoting if they are Big Endian (BE) encoded or Little-Endian (LE) encoded. Supports legacy, segwit v0 and segwit v1 (taproot) Bitcoin transactions.

## Example use

```Javascript

```
See the test directories instance data for more examples.

## Caveats
This library is NOT production ready and should be used only for educational purposes at this stage. Limitations include:
- 

## Motivation
- This library exists out of a personal need to create a Taproot library, specifically functionality around Taproot Signatures. “Fragments” of a transaction are required to be placed in the message, which is signed, normally in their serialised forms. Hence the existence of this library to split out the transaction into its multiple fragment-encoded-parts.
- Provide users with the explicit encoding format of each fragment of a serialised tx, mainly if they are little or big endian encoded which can be confusing for beginners as bitcoin uses a mixture within the same serialized object.
- Aimed at beginner developers who are more comfortable with using string instead of BufferArrays which is common in more advanced Bitcoin development.

## Features
- CTransaction
- CTxIn
- CTxOut

## Class Design
This library provides a single class which represents a Raw Bitcoin Transaction (SerializedTransaction) which contains attributes which represent each significant fragment of a bitcoin transaction. These attributes are provided in raw hex form using strings. Typescript Interfaces are uses to represent composite structure within the SerializedTransaction e.g. PreviousOutput. A UML diagram is provided of the Typescript Class and Interface design.

Note how each attribute (apart from arrays) is suffixed with either ```_LE``` or ```_BE```. This indicates if the fragment is encoding in Little or Big-Endian respectively.

![alt text](./docs/serialized_transaction_uml.jpg?raw=true "SerializedTransaction Data Model (UML)")

Currently there is only a single method on this class which is ```getOutpoint()```, which provides a concatenation of PreviousOutput.transactionHash_LE + PreviousOutput.utxoIndex_LE. Outpoints are used as part of the message which gets signed as part of the segwit v0 and v1 (taproot) signature regimes. See BIP-0143 and BIP-0341 respectively.

## How to use

### Installation

```
npm install bitcoin-dump-format
```

### Use (node.js)

```Javascript
const { SerializedTransaction } = require('raw-tx-splitter');


const rawTx = "020000000001015036a4e1e299...48700000000"
const serializedTx = new SerializedTransaction(rawTx);
```

### Tests
Run current tests using:

```
npm test
```
These tests use the Jest test framework.

## LICENSE [MIT](LICENSE)
