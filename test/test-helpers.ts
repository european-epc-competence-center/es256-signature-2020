/*!
 * Copyright (c) 2024 Christian Fries. All rights reserved.
 */

import * as jose from 'jose';

/**
 * Creates a verifier for testing signature verification
 */
export async function createVerifier(publicKeyJwk: any) {
  const publicKey = await jose.importJWK(publicKeyJwk, 'ES256');
  
  return {
    async verify({ data, signature }: { data: Uint8Array; signature: Uint8Array }) {
      try {
        // Reconstruct a flattened JWS for verification
        const jws = {
          protected: jose.base64url.encode(
            new TextEncoder().encode(JSON.stringify({ alg: 'ES256' }))
          ),
          payload: jose.base64url.encode(data),
          signature: jose.base64url.encode(signature)
        };
        
        // Verify using jose's flattenedVerify
        await jose.flattenedVerify(jws, publicKey);
        return true;
      } catch (e) {
        return false;
      }
    }
  };
}

