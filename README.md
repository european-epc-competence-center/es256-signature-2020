# ES256Signature2020 Suite

A Linked Data Signature suite for creating and verifying Data Integrity Proofs using ECDSA with the P-256 curve (ES256 algorithm).

## Installation

Install from NPM:
```
npm i @eecc/es256-signature-2020
```

## Usage

### Signing a Verifiable Credential

```javascript
import jsigs from 'jsonld-signatures';
import * as jose from 'jose';
import { ES256Signature2020 } from 'es256-signature-2020';

const { purposes: { AssertionProofPurpose } } = jsigs;

// Create an unsigned credential
const unsignedCredential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1'
  ],
  id: 'https://example.edu/credentials/3732',
  type: ['VerifiableCredential'],
  issuer: 'https://example.edu/issuers/565049',
  issuanceDate: '2020-03-10T04:24:12.164Z',
  credentialSubject: {
    id: 'did:example:ebfeb1f712ebc6f1c276e12ec21'
  }
};

// Generate an ES256 key pair
const generatedKeyPair = await jose.generateKeyPair('ES256', { extractable: true });
const privateKeyJwk = await jose.exportJWK(generatedKeyPair.privateKey);
const publicKeyJwk = await jose.exportJWK(generatedKeyPair.publicKey);

// Create a key object with DID-based identifier
const key = {
  id: 'did:web:example.com#keys-1',
  type: 'JsonWebKey2020',
  controller: 'did:web:example.com',
  privateKey: privateKeyJwk
};

// Create the suite with the key
const suite = new ES256Signature2020({ key });

// Sign the credential
const signedCredential = await jsigs.sign(unsignedCredential, {
  suite,
  purpose: new AssertionProofPurpose(),
  documentLoader
});

console.log(JSON.stringify(signedCredential, null, 2));
```

**Result:**

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "id": "https://example.edu/credentials/3732",
  "type": ["VerifiableCredential"],
  "issuer": "https://example.edu/issuers/565049",
  "issuanceDate": "2020-03-10T04:24:12.164Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21"
  },
  "proof": {
    "type": "EcdsaSecp256r1Signature2019",
    "created": "2024-11-06T10:23:45Z",
    "verificationMethod": "did:web:example.com#keys-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z3QJPuVjHMfKMVvnvP3YdKNZvxVj5xGc..."
  }
}
```

### Verifying a Signed Credential

```javascript
import jsigs from 'jsonld-signatures';
import { ES256Signature2020 } from 'es256-signature-2020';

const { purposes: { AssertionProofPurpose } } = jsigs;

// The signed credential from above
const signedCredential = { /* ... */ };

// Create a verification suite
const suite = new ES256Signature2020();

// Verify the credential
const result = await jsigs.verify(signedCredential, {
  suite,
  purpose: new AssertionProofPurpose(),
  documentLoader
});

console.log('Verified:', result.verified); // true
```

## Compatibility

This library is compatible with [`@digitalbazaar/ecdsa-multikey`](https://github.com/digitalbazaar/ecdsa-multikey) for P-256 curve keys. You can use `EcdsaMultikey` key pairs with this signature suite, as demonstrated in our test suite.

## Licence
[BSD 3-Clause License](LICENSE) © 2025 European EPC Competence Center GmbH
