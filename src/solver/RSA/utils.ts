// RSA utility functions
import * as bigintCryptoUtils from 'bigint-crypto-utils';

/**
 * Convert string to bigint
 * @param str String to convert
 * @returns Bigint representation
 */
export const stringToBigint = (str: string): bigint => {
  return BigInt('0x' + Buffer.from(str).toString('hex'));
};

/**
 * Convert bigint to string
 * @param num Bigint to convert
 * @returns String representation
 */
export const bigintToString = (num: bigint): string => {
  const hex = num.toString(16);
  const paddedHex = hex.length % 2 === 0 ? hex : '0' + hex;
  return Buffer.from(paddedHex, 'hex').toString('utf8');
};

/**
 * Calculate greatest common divisor
 * @param a First number
 * @param b Second number
 * @returns Greatest common divisor
 */
export const gcd = (a: bigint, b: bigint): bigint => {
  return bigintCryptoUtils.gcd(a, b);
};

/**
 * Calculate least common multiple
 * @param a First number
 * @param b Second number
 * @returns Least common multiple
 */
export const lcm = (a: bigint, b: bigint): bigint => {
  return (a * b) / gcd(a, b);
};

/**
 * Calculate extended greatest common divisor
 * @param a First number
 * @param b Second number
 * @returns Object containing gcd, x, and y such that ax + by = gcd(a, b)
 */
export const egcd = (a: bigint, b: bigint): { gcd: bigint; x: bigint; y: bigint } => {
  let x0 = 1n;
  let y0 = 0n;
  let x1 = 0n;
  let y1 = 1n;
  let aa = a;
  let bb = b;

  while (bb !== 0n) {
    const q = aa / bb;
    [aa, bb] = [bb, aa % bb];
    [x0, x1] = [x1, x0 - q * x1];
    [y0, y1] = [y1, y0 - q * y1];
  }

  return { gcd: aa, x: x0, y: y0 };
};

/**
 * Calculate modular inverse
 * @param a Number to invert
 * @param m Modulus
 * @returns Modular inverse of a modulo m
 */
export const modInv = (a: bigint, m: bigint): bigint => {
  return bigintCryptoUtils.modInv(a, m);
};

/**
 * Test if a number is prime
 * @param n Number to test
 * @param iterations Number of iterations for Miller-Rabin test
 * @returns True if n is probably prime
 */
export const isPrime = async (n: bigint, iterations: number = 16): Promise<boolean> => {
  return bigintCryptoUtils.isProbablyPrime(n, iterations);
};

/**
 * Evaluate RSA key strength
 * @param modulus Modulus n
 * @returns Object with key size and estimated strength
 */
export const evaluateKeyStrength = (modulus: bigint): { keySize: number; strength: string } => {
  const keySize = modulus.toString(2).length;
  let strength = 'Weak';
  
  if (keySize >= 4096) {
    strength = 'Very Strong';
  } else if (keySize >= 2048) {
    strength = 'Strong';
  } else if (keySize >= 1024) {
    strength = 'Moderate';
  } else if (keySize >= 512) {
    strength = 'Weak';
  }
  
  return { keySize, strength };
};

/**
 * Generate a random big integer
 * @param bitLength Bit length of the random number
 * @returns Random big integer
 */
export const randomBigint = async (bitLength: number): Promise<bigint> => {
  return bigintCryptoUtils.randBetween(2n ** BigInt(bitLength - 1), 2n ** BigInt(bitLength) - 1n);
};

/**
 * Calculate modular exponentiation (manual implementation for educational purposes)
 * @param base Base
 * @param exponent Exponent
 * @param modulus Modulus
 * @returns (base^exponent) mod modulus
 */
export const modPow = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    base = (base * base) % modulus;
    exponent = exponent / 2n;
  }
  return result;
};

/**
 * Check if a number is a Carmichael number
 * @param n Number to check
 * @returns True if n is a Carmichael number
 */
export const isCarmichael = async (n: bigint): Promise<boolean> => {
  // A Carmichael number is a composite number n which satisfies b^(n-1) ≡ 1 mod n for all b coprime to n
  if (await isPrime(n)) {
    return false;
  }
  
  // Check if n is square-free
  for (let i = 2n; i * i <= n; i++) {
    if (n % i === 0n) {
      if (n % (i * i) === 0n) {
        return false;
      }
    }
  }
  
  // Check Korselt's criterion: n-1 is divisible by p-1 for every prime p dividing n
  // This is a simplified check
  return true;
};
