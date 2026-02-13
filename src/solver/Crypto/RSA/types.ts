// RSA types and interfaces

/**
 * RSA key pair
 */
export interface RSAKeyPair {
  publicKey: {
    n: bigint;
    e: bigint;
  };
  privateKey: {
    d: bigint;
    n: bigint;
  };
}

/**
 * RSA ciphertext
 */
export interface RSACiphertext {
  ciphertext: bigint;
  publicKey: {
    n: bigint;
    e: bigint;
  };
}

/**
 * RSA private key with primes
 */
export interface RSAPrivateKeyWithPrimes {
  d: bigint;
  n: bigint;
  p: bigint;
  q: bigint;
}

/**
 * RSA public key
 */
export interface RSAPublicKey {
  n: bigint;
  e: bigint;
}

/**
 * RSA private key
 */
export interface RSAPrivateKey {
  d: bigint;
  n: bigint;
}

/**
 * Factor result
 */
export interface FactorResult {
  p: bigint;
  q: bigint;
}
