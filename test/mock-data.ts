/*!
 * Copyright (c) 2024 Christian Fries. All rights reserved.
 */

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
 * JWS 2020 context definition
 * Based on the official context at https://w3c.github.io/vc-jws-2020/contexts/v1/
 */
export const jwsContext = {
  '@context': {
    privateKeyJwk: {
      '@id': 'https://w3id.org/security#privateKeyJwk',
      '@type': '@json'
    },
    JsonWebKey2020: {
      '@id': 'https://w3id.org/security#JsonWebKey2020',
      '@context': {
        '@protected': true,
        'id': '@id',
        'type': '@type',
        'publicKeyJwk': {
          '@id': 'https://w3id.org/security#publicKeyJwk',
          '@type': '@json'
        }
      }
    },
    JsonWebSignature2020: {
      '@id': 'https://w3id.org/security#JsonWebSignature2020',
      '@context': {
        '@protected': true,
        'id': '@id',
        'type': '@type',
        'challenge': 'https://w3id.org/security#challenge',
        'created': {
          '@id': 'http://purl.org/dc/terms/created',
          '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
        },
        'domain': 'https://w3id.org/security#domain',
        'expires': {
          '@id': 'https://w3id.org/security#expiration',
          '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
        },
        'jws': 'https://w3id.org/security#jws',
        'nonce': 'https://w3id.org/security#nonce',
        'proofPurpose': {
          '@id': 'https://w3id.org/security#proofPurpose',
          '@type': '@vocab',
          '@context': {
            '@protected': true,
            'id': '@id',
            'type': '@type',
            'assertionMethod': {
              '@id': 'https://w3id.org/security#assertionMethod',
              '@type': '@id',
              '@container': '@set'
            },
            'authentication': {
              '@id': 'https://w3id.org/security#authenticationMethod',
              '@type': '@id',
              '@container': '@set'
            },
            'capabilityInvocation': {
              '@id': 'https://w3id.org/security#capabilityInvocationMethod',
              '@type': '@id',
              '@container': '@set'
            },
            'capabilityDelegation': {
              '@id': 'https://w3id.org/security#capabilityDelegationMethod',
              '@type': '@id',
              '@container': '@set'
            },
            'keyAgreement': {
              '@id': 'https://w3id.org/security#keyAgreementMethod',
              '@type': '@id',
              '@container': '@set'
            }
          }
        },
        'verificationMethod': {
          '@id': 'https://w3id.org/security#verificationMethod',
          '@type': '@id'
        }
      }
    }
  }
};

