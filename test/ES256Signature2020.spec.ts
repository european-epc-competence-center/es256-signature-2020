/*!
 * Copyright (c) 2024 Christian Fries. All rights reserved.
 */

import { expect } from 'chai';
// @ts-ignore
import jsigs from 'jsonld-signatures';
import { ES256Signature2020 } from '../lib/ES256Signature2020';
import { mockCredential, jwsContext } from './mock-data';
import * as jose from 'jose';
// @ts-ignore
import { securityLoader } from '@digitalbazaar/security-document-loader';

const { purposes: { AssertionProofPurpose } } = jsigs;

describe('ES256Signature2020', () => {
  let suite: ES256Signature2020;
  let documentLoader: any;
  let keyPair: any;

  beforeEach(async () => {
    // Generate fresh ES256 key pair for each test
    const generatedKeyPair = await jose.generateKeyPair("ES256", { extractable: true });

    // Export keys to JWK format
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

    // Create DID document with the generated key
    const didDocument = {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/jws-2020/v1'
      ],
      id: 'did:web:example.com',
      assertionMethod: [keyPair.id],
      verificationMethod: [keyPair]
    };

    // Set up document loader with security contexts
    const loader = securityLoader();
    
    // Add JWS 2020 context
    loader.addStatic(
      'https://w3id.org/security/suites/jws-2020/v1',
      jwsContext
    );
    
    // Add DID document to the loader
    loader.addStatic(
      didDocument.id,
      didDocument
    );
    
    // Add key document to the loader
    loader.addStatic(
      keyPair.id,
      keyPair
    );
    
    // Build the document loader
    const builtLoader = loader.build();
    
    // Wrap the document loader to handle network errors gracefully
    documentLoader = async (url: string) => {
      try {
        return await builtLoader(url);
      } catch (error: any) {
        console.error(`Failed to load document: ${url}`, error.message);
        throw error;
      }
    };
  });

  describe('sign and verify', () => {
    it('should sign and verify a credential using default signer', async () => {
      // Create key with privateKey to use the default signer
      const key = {
        id: keyPair.id,
        type: keyPair.type,
        controller: keyPair.controller,
        publicKey: keyPair.publicKeyJwk,
        privateKey: keyPair.privateKeyJwk
      };

      // Create suite with key - the default signer will be used automatically
      suite = new ES256Signature2020({
        key
      });

      // Sign the credential
      const signedCredential = await jsigs.sign(mockCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      // Verify the credential has a proof
      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof).to.have.property('type', 'EcdsaSecp256r1Signature2019');
      expect(signedCredential.proof).to.have.property('proofValue');
      expect(signedCredential.proof.proofValue).to.match(/^z/);

      // Import the public key for verification using Web Crypto API
      const publicKey = await crypto.subtle.importKey(
        'jwk',
        keyPair.publicKeyJwk,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );
      
      // Create verifier using Web Crypto API
      const verifier = {
        async verify({ data, signature }: { data: Uint8Array; signature: Uint8Array }) {
          try {
            // Use Web Crypto API for verification
            const isValid = await crypto.subtle.verify(
              { name: 'ECDSA', hash: 'SHA-256' },
              publicKey,
              signature as BufferSource,
              data as BufferSource
            );
            return isValid;
          } catch (e) {
            return false;
          }
        },
        id: keyPair.id
      };

      // Create suite for verification
      const verifySuite = new ES256Signature2020({
        verifier
      });

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

