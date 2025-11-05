/*!
 * Copyright (c) 2024 Christian Fries. All rights reserved.
 */

/**
 * Mock ES256 key pair (P-256 curve) for testing
 * Generated using jose library
 */
export const mockKeyPair = {
  id: 'https://example.edu/issuers/565049#keys-1',
  type: 'JsonWebKey2020',
  controller: 'https://example.edu/issuers/565049',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'P-256',
    x: 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU',
    y: 'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0'
  },
  privateKeyJwk: {
    kty: 'EC',
    crv: 'P-256',
    x: 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU',
    y: 'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0',
    d: 'jpsQnnGQmL-YBIffH1136cspYG6-0iY7X1fCE9-E9LI'
  }
};

/**
 * Mock credential for testing
 */
export const mockCredential = {
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

/**
 * Mock DID document for the issuer
 */
export const mockDidDocument = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/suites/jws-2020/v1'
  ],
  id: 'https://example.edu/issuers/565049',
  assertionMethod: [mockKeyPair.id],
  verificationMethod: [mockKeyPair]
};

/**
 * JWS 2020 context definition
 * Simplified version for testing
 */
export const jwsContext = {
  '@context': {
    JsonWebKey2020: 'https://w3id.org/security#JsonWebKey2020',
    EcdsaSecp256r1Signature2019: 'https://w3id.org/security#EcdsaSecp256r1Signature2019',
    publicKeyJwk: {
      '@id': 'https://w3id.org/security#publicKeyJwk',
      '@type': '@json'
    }
  }
};

