// RSA encryption and decryption
import * as bigintCryptoUtils from 'bigint-crypto-utils';
import { RSAPublicKey, RSAPrivateKey, RSAPrivateKeyWithPrimes } from './types';

/**
 * RSA encryption
 * @param message Plaintext message (as bigint)
 * @param publicKey Public key
 * @returns Ciphertext
 */
export const encrypt = (message: bigint, publicKey: RSAPublicKey): bigint => {
  return bigintCryptoUtils.modPow(message, publicKey.e, publicKey.n);
};

/**
 * RSA decryption
 * @param ciphertext Ciphertext (as bigint)
 * @param privateKey Private key
 * @returns Plaintext message
 */
export const decrypt = (ciphertext: bigint, privateKey: RSAPrivateKey): bigint => {
  return bigintCryptoUtils.modPow(ciphertext, privateKey.d, privateKey.n);
};

/**
 * RSA decryption with CRT (Chinese Remainder Theorem) for faster decryption
 * @param ciphertext Ciphertext (as bigint)
 * @param privateKey Private key with p and q
 * @returns Plaintext message
 */
export const decryptCRT = (
  ciphertext: bigint,
  privateKey: RSAPrivateKeyWithPrimes
): bigint => {
  // Calculate dp = d mod (p-1)
  const dp = privateKey.d % (privateKey.p - 1n);
  
  // Calculate dq = d mod (q-1)
  const dq = privateKey.d % (privateKey.q - 1n);
  
  // Calculate qinv = q^-1 mod p
  const qinv = bigintCryptoUtils.modInv(privateKey.q, privateKey.p);
  
  // Calculate m1 = c^dp mod p
  const m1 = bigintCryptoUtils.modPow(ciphertext, dp, privateKey.p);
  
  // Calculate m2 = c^dq mod q
  const m2 = bigintCryptoUtils.modPow(ciphertext, dq, privateKey.q);
  
  // Calculate h = qinv * (m1 - m2) mod p
  let h = (m1 - m2) * qinv;
  h = h % privateKey.p;
  if (h < 0n) {
    h += privateKey.p;
  }
  
  // Calculate m = m2 + h * q
  const m = m2 + h * privateKey.q;
  
  return m;
};
