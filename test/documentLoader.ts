/*!
 * Copyright (c) 2024 Christian Fries. All rights reserved.
 */

// @ts-ignore
import { securityLoader } from '@digitalbazaar/security-document-loader';
import { jwsContext } from './mock-data';

/**
 * Creates a document loader configured with security contexts and test documents
 */
export function createDocumentLoader(didDocument: any, keyPair: any) {
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
  return async (url: string) => {
    try {
      return await builtLoader(url);
    } catch (error: any) {
      console.error(`Failed to load document: ${url}`, error.message);
      throw error;
    }
  };
}

/**
 * Creates a DID document for testing
 */
export function createDidDocument(keyPair: any) {
  return {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/jws-2020/v1'
    ],
    id: keyPair.controller,
    assertionMethod: [keyPair.id],
    verificationMethod: [keyPair]
  };
}

