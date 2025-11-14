/*!
 * Copyright (c) 2024 Christian Fries. All rights reserved.
 */

import { expect } from 'chai';
import * as jose from 'jose';
// @ts-ignore
import jsigs from 'jsonld-signatures';
import { ES256Signature2020 } from '../lib/ES256Signature2020.js';
import { mockCredential } from './mock-data.js';
import { createDocumentLoader, createDidDocument } from './documentLoader.js';

const { purposes: { AssertionProofPurpose } } = jsigs;

describe('ES256Signature2020', () => {
  let suite: ES256Signature2020;
  let documentLoader: any;
  let keyPair: any;

  beforeEach(async () => {
    // Generate fresh ES256 key pair for each test
    const generatedKeyPair = await jose.generateKeyPair("ES256", { extractable: true });
    const privateKeyJwkRaw = await jose.exportJWK(generatedKeyPair.privateKey);
    const publicKeyJwkRaw = await jose.exportJWK(generatedKeyPair.publicKey);

    // Create key pair object with DID-based identifier
    keyPair = {
      id: 'did:web:example.com#keys-1',
      type: 'JsonWebKey2020',
      controller: 'did:web:example.com',
      publicKeyJwk: publicKeyJwkRaw,
      privateKeyJwk: privateKeyJwkRaw
    };

    // Set up document loader with DID document and key
    const didDocument = createDidDocument(keyPair);
    documentLoader = createDocumentLoader(didDocument, keyPair);
  });

  describe('sign and verify', () => {
    it('should sign and verify a credential using default signer', async () => {
      // Create key with privateKey to use the default signer
      const key = {
        id: keyPair.id,
        type: keyPair.type,
        controller: keyPair.controller,
        privateKey: keyPair.privateKeyJwk
      };

      // Create suite with key - the default signer will be used automatically
      suite = new ES256Signature2020({ key });

      // Sign the credential
      const signedCredential = await jsigs.sign({ ...mockCredential }, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      // Verify the credential has a proof
      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof).to.have.property('type', 'JsonWebSignature2020');
      expect(signedCredential.proof).to.have.property('proofValue');
      expect(signedCredential.proof.proofValue).to.match(/^z/);

      // Create verification suite without explicit verifier
      // The default verifier will be created automatically from the verification method
      const verifySuite = new ES256Signature2020();

      // Verify the signed credential
      const result = await jsigs.verify(signedCredential, {
        suite: verifySuite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      // Check verification result
      expect(result).to.have.property('verified', true);
    });

    it('should sign and verify a credential using EcdsaMultikey', async () => {
      // Dynamically import ES module to avoid CommonJS/ESM interop issues
      // @ts-ignore
      const EcdsaMultikey = await import('@digitalbazaar/ecdsa-multikey');
      
      // Create EcdsaMultikey from the existing keyPair's JWK
      const ecdsaMultikey = await EcdsaMultikey.fromJwk({
        jwk: keyPair.privateKeyJwk,
        secretKey: true,
        id: keyPair.id,
        controller: keyPair.controller
      });

      // Create suite with the EcdsaMultikey - it has built-in signer
      suite = new ES256Signature2020({ key: ecdsaMultikey });

      // Sign the credential
      const signedCredential = await jsigs.sign({ ...mockCredential }, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      // Verify the credential has a proof
      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof).to.have.property('type', 'JsonWebSignature2020');
      expect(signedCredential.proof).to.have.property('proofValue');
      expect(signedCredential.proof.proofValue).to.match(/^z/);
      
      const verifySuite = new ES256Signature2020();

      // Verify the signed credential
      const result = await jsigs.verify(signedCredential, {
        suite: verifySuite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      // Check verification result
      expect(result).to.have.property('verified', true);
    });
  });
});

