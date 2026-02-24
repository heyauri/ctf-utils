// RSA attacks
import * as bigintCryptoUtils from 'bigint-crypto-utils';
import { RSAPublicKey, RSAPrivateKey, FactorResult } from './types';
import { egcd, modInv, gcd } from './utils';
import * as crypto from './crypto';
import { pollardsRho } from '../../Math/index';

/**
 * Compute the continued fraction expansion of a/b
 * @param a Numerator
 * @param b Denominator
 * @returns Array of continued fraction coefficients
 */
const continuedFraction = (a: bigint, b: bigint): bigint[] => {
  const result: bigint[] = [];
  while (b !== 0n) {
    result.push(a / b);
    const temp = a;
    a = b;
    b = temp % b;
  }
  return result;
};

/**
 * Compute the convergents of a continued fraction
 * @param cf Continued fraction coefficients
 * @returns Array of convergents as {k, d} objects
 */
const convergents = (cf: bigint[]): { k: bigint; d: bigint }[] => {
  const result: { k: bigint; d: bigint }[] = [];
  let h_prev_prev = 0n;
  let h_prev = 1n;
  let k_prev_prev = 1n;
  let k_prev = 0n;
  
  for (const a of cf) {
    const h = a * h_prev + h_prev_prev;
    const k = a * k_prev + k_prev_prev;
    result.push({ k, d: h });
    
    h_prev_prev = h_prev;
    h_prev = h;
    k_prev_prev = k_prev;
    k_prev = k;
  }
  
  return result;
};

/**
 * Compute the greatest common divisor (GCD) of two polynomials modulo n
 * @param poly1 First polynomial represented as array of coefficients [x^3, x^2, x, constant]
 * @param poly2 Second polynomial represented as array of coefficients
 * @param n Modulus
 * @returns GCD polynomial represented as array of coefficients
 */
const polynomialGCD = (poly1: bigint[], poly2: bigint[], n: bigint): bigint[] => {
  // Clone polynomials to avoid modifying original arrays
  let a = [...poly1];
  let b = [...poly2];
  
  // Remove leading zeros from both polynomials first
  while (a.length > 0 && a[0] === 0n) {
    a.shift();
  }
  while (b.length > 0 && b[0] === 0n) {
    b.shift();
  }
  
  // Handle edge cases
  if (a.length === 0) return [0n];
  if (b.length === 0) {
    // Normalize the result (leading coefficient should be 1)
    if (a.length > 0) {
      const leadingCoeff = a[0];
      if (leadingCoeff !== 1n && leadingCoeff !== 0n) {
        try {
          const invLeadingCoeff = modInv(leadingCoeff, n);
          for (let i = 0; i < a.length; i++) {
            a[i] = (a[i] * invLeadingCoeff) % n;
            if (a[i] < 0n) {
              a[i] += n;
            }
          }
        } catch (error) {
          // If modInv fails, return the polynomial as is
        }
      }
      
      // Remove leading zeros
      while (a.length > 0 && a[0] === 0n) {
        a.shift();
      }
    }
    return a.length > 0 ? a : [0n];
  }
  
  // Polynomial division until remainder is zero
  while (b.length > 0 && b.some(coeff => coeff !== 0n)) {
    // Compute quotient and remainder
    const [, remainder] = polynomialDivide(a, b, n);
    
    // Update a and b for next iteration
    a = b;
    b = remainder;
    
    // Remove leading zeros from b to optimize next iteration
    while (b.length > 0 && b[0] === 0n) {
      b.shift();
    }
    
    // Early termination for performance
    if (b.length === 1 && b[0] === 0n) {
      break;
    }
  }
  
  // Normalize the result (leading coefficient should be 1)
  if (a.length > 0) {
    const leadingCoeff = a[0];
    if (leadingCoeff !== 1n && leadingCoeff !== 0n) {
      try {
        const invLeadingCoeff = modInv(leadingCoeff, n);
        for (let i = 0; i < a.length; i++) {
          a[i] = (a[i] * invLeadingCoeff) % n;
          if (a[i] < 0n) {
            a[i] += n;
          }
        }
      } catch (error) {
        // If modInv fails, return the polynomial as is
      }
    }
    
    // Remove leading zeros
    while (a.length > 0 && a[0] === 0n) {
      a.shift();
    }
  }
  
  return a.length > 0 ? a : [0n];
};

/**
 * Divide two polynomials modulo n
 * @param dividend Dividend polynomial
 * @param divisor Divisor polynomial
 * @param n Modulus
 * @returns [quotient, remainder] polynomials
 */
const polynomialDivide = (dividend: bigint[], divisor: bigint[], n: bigint): [bigint[], bigint[]] => {
  // Initialize quotient and remainder
  const quotient: bigint[] = [];
  let remainder = [...dividend];
  
  const divisorDegree = divisor.length - 1;
  const divisorLeading = divisor[0];
  const invDivisorLeading = modInv(divisorLeading, n);
  
  // Early return if dividend degree is less than divisor degree
  if (remainder.length <= divisorDegree) {
    return [[], remainder.length > 0 ? remainder : [0n]];
  }
  
  // Perform polynomial long division
  while (remainder.length > divisorDegree) {
    const remainderDegree = remainder.length - 1;
    const leadingCoeff = remainder[0];
    
    // Compute the current term of the quotient
    const currentQuotientTerm = (leadingCoeff * invDivisorLeading) % n;
    quotient.push(currentQuotientTerm);
    
    // Subtract (currentQuotientTerm * divisor) from remainder
    for (let i = 0; i <= divisorDegree; i++) {
      const term = (currentQuotientTerm * divisor[i]) % n;
      remainder[i] = (remainder[i] - term) % n;
      if (remainder[i] < 0n) {
        remainder[i] += n;
      }
    }
    
    // Remove leading zeros efficiently
    while (remainder.length > 0 && remainder[0] === 0n) {
      remainder.shift();
    }
    
    // Early termination if remainder is zero
    if (remainder.length === 0) {
      break;
    }
  }
  
  return [quotient, remainder.length > 0 ? remainder : [0n]];
};

/**
 * Small exponent attack (e=3)
 * @param ciphertext Ciphertext
 * @param publicKey Public key
 * @returns Decrypted message
 */
export const smallExponent = (ciphertext: bigint, publicKey: RSAPublicKey): bigint => {
  if (publicKey.e !== 3n) {
    throw new Error('Small exponent attack requires e=3');
  }
  
  const { n } = publicKey;
  
  // Calculate cube root using efficient algorithm
  // First, try to find integer cube root directly using optimized binary search
  let low = 0n;
  let high = n;
  
  while (low <= high) {
    const mid = (low + high) / 2n;
    const mid3 = mid * mid * mid;
    
    if (mid3 === ciphertext) {
      return mid;
    } else if (mid3 < ciphertext) {
      low = mid + 1n;
    } else {
      high = mid - 1n;
    }
  }
  
  // If direct cube root fails, try the RSA equation: m^3 ≡ c mod n
  // For small n, use optimized brute-force with early termination
  const maxBruteForce = 1000000n; // Set a reasonable limit
  if (n < maxBruteForce) {
    for (let m = 0n; m < n; m++) {
      if (m * m * m % n === ciphertext) {
        return m;
      }
    }
  } else {
    // For large n, use the fact that m^3 < c + k*n for some small k
    // This is more efficient than brute-force for large n
    const kMax = 10n; // Try small values of k
    for (let k = 0n; k < kMax; k++) {
      const target = ciphertext + k * n;
      // Calculate integer cube root of target
      let m = BigInt(Math.floor(Math.cbrt(Number(target))));
      // Check nearby values
      for (let delta = -2n; delta <= 2n; delta++) {
        const candidate = m + delta;
        if (candidate < 0n) continue;
        if (candidate * candidate * candidate === target) {
          return candidate;
        }
      }
    }
  }
  
  throw new Error('Small exponent attack failed');
};

/**
 * Common modulus attack
 * @param ciphertext1 First ciphertext
 * @param ciphertext2 Second ciphertext
 * @param publicKey1 First public key
 * @param publicKey2 Second public key
 * @returns Decrypted message
 */
export const commonModulus = (
  ciphertext1: bigint,
  ciphertext2: bigint,
  publicKey1: RSAPublicKey,
  publicKey2: RSAPublicKey
): bigint => {
  if (publicKey1.n !== publicKey2.n) {
    throw new Error('Common modulus attack requires same modulus');
  }
  
  const n = publicKey1.n;
  const e1 = publicKey1.e;
  const e2 = publicKey2.e;
  
  // Find integers x and y such that e1*x + e2*y = 1
  const { gcd: g, x, y } = egcd(e1, e2);
  
  if (g !== 1n) {
    throw new Error('Public exponents must be coprime');
  }
  
  // Calculate m = (c1^x * c2^y) mod n using optimized exponentiation
  let term1: bigint;
  let term2: bigint;
  
  if (x > 0n) {
    term1 = bigintCryptoUtils.modPow(ciphertext1, x, n);
  } else {
    const c1Inv = bigintCryptoUtils.modInv(ciphertext1, n);
    term1 = bigintCryptoUtils.modPow(c1Inv, -x, n);
  }
  
  if (y > 0n) {
    term2 = bigintCryptoUtils.modPow(ciphertext2, y, n);
  } else {
    const c2Inv = bigintCryptoUtils.modInv(ciphertext2, n);
    term2 = bigintCryptoUtils.modPow(c2Inv, -y, n);
  }
  
  let m = (term1 * term2) % n;
  
  if (m < 0n) {
    m += n;
  }
  
  return m;
};

/**
 * Wiener's attack (small private exponent)
 * @param publicKey Public key
 * @returns Private key if found
 */
export const wiener = (publicKey: RSAPublicKey): RSAPrivateKey | null => {
  // Implementation of Wiener's attack
  const { n, e } = publicKey;
  
  const cf = continuedFraction(e, n);
  const convs = convergents(cf);
  
  // Precompute test message and its encryption for faster verification
  const testMessage = 2n;
  const encryptedTestMessage = bigintCryptoUtils.modPow(testMessage, e, n);
  
  // Check each convergent
  for (const { k, d } of convs) {
    if (k === 0n || d === 0n) continue;
    
    // Check if d is the private exponent
    try {
      const decryptedMessage = bigintCryptoUtils.modPow(encryptedTestMessage, d, n);
      if (decryptedMessage === testMessage) {
        return { d, n };
      }
    } catch (error) {
      // Skip if modPow fails
      continue;
    }
  }
  
  return null;
};

/**
 * Hastad's broadcast attack
 * @param ciphertexts Array of ciphertexts
 * @param publicKeys Array of public keys (all with e=3)
 * @returns Decrypted message
 */
export const hastadBroadcast = (ciphertexts: bigint[], publicKeys: RSAPublicKey[]): bigint => {
  if (ciphertexts.length !== publicKeys.length) {
    throw new Error('Number of ciphertexts must match number of public keys');
  }
  
  if (publicKeys.some(key => key.e !== 3n)) {
    throw new Error('Hastad\'s broadcast attack requires e=3 for all public keys');
  }
  
  // Chinese Remainder Theorem implementation with optimized performance
  const crt = (remainders: bigint[], moduli: bigint[]): bigint => {
    let result = 0n;
    let product = moduli.reduce((a, b) => a * b, 1n);
    
    for (let i = 0; i < remainders.length; i++) {
      const mi = moduli[i];
      const bi = remainders[i];
      const ni = product / mi;
      const niInverse = bigintCryptoUtils.modInv(ni, mi);
      result += bi * ni * niInverse;
    }
    
    return result % product;
  };
  
  const moduli = publicKeys.map(key => key.n);
  const c = crt(ciphertexts, moduli);
  
  // Calculate cube root using efficient algorithm
  // First, try to find integer cube root directly
  let low = 0n;
  let high = c;
  
  while (low <= high) {
    const mid = (low + high) / 2n;
    const mid3 = mid * mid * mid;
    
    if (mid3 === c) {
      return mid;
    } else if (mid3 < c) {
      low = mid + 1n;
    } else {
      high = mid - 1n;
    }
  }
  
  // If binary search fails, try a more efficient approach
  // Calculate integer cube root using Math.cbrt for large c
  let m = BigInt(Math.floor(Math.cbrt(Number(c))));
  // Check nearby values
  for (let delta = -5n; delta <= 5n; delta++) {
    const candidate = m + delta;
    if (candidate < 0n) continue;
    if (candidate * candidate * candidate === c) {
      return candidate;
    }
  }
  
  throw new Error('Hastad\'s broadcast attack failed');
};

/**
 * Franklin-Reiter related message attack
 * @param ciphertext1 First ciphertext
 * @param ciphertext2 Second ciphertext
 * @param publicKey Public key
 * @param a Coefficient of linear function f(x) = a*x + b
 * @param b Constant of linear function f(x) = a*x + b
 * @returns Decrypted message
 */
export const franklinReiter = (
  ciphertext1: bigint,
  ciphertext2: bigint,
  publicKey: RSAPublicKey,
  a: bigint,
  b: bigint
): bigint => {
  const { n, e } = publicKey;
  
  // The attack works by constructing two polynomials and computing their GCD
  // Polynomial 1: x^e - c1 mod n
  // Polynomial 2: (a*x + b)^e - c2 mod n
  // The GCD of these polynomials should be (x - m1), where m1 is the first message
  
  // For e=3, we can solve this directly using polynomial GCD
  if (e === 3n) {
    // Expand (a*x + b)^3 - c2 = a^3 x^3 + 3a^2 b x^2 + 3ab^2 x + (b^3 - c2)
    // And x^3 - c1
    // We can use the extended Euclidean algorithm for polynomials modulo n
    
    // Coefficients of the first polynomial: x^3 - c1
    const poly1 = [1n, 0n, 0n, (-ciphertext1) % n];
    
    // Coefficients of the second polynomial: a^3 x^3 + 3a^2 b x^2 + 3ab^2 x + (b^3 - c2)
    const a3 = (a * a * a) % n;
    const a2b3 = (3n * a * a * b) % n;
    const ab23 = (3n * a * b * b) % n;
    const b3c2 = (b * b * b - ciphertext2) % n;
    const poly2 = [a3, a2b3, ab23, b3c2];
    
    // Compute polynomial GCD using extended Euclidean algorithm
    const gcdPoly = polynomialGCD(poly1, poly2, n);
    
    // If GCD is linear (degree 1), extract the root
    if (gcdPoly.length === 2) {
      const [coeff1, coeff0] = gcdPoly;
      if (coeff1 !== 0n) {
        // Solve coeff1 * x + coeff0 ≡ 0 mod n
        const x = (-coeff0 * modInv(coeff1, n)) % n;
        return x < 0n ? x + n : x;
      }
    }
    
    // If polynomial GCD fails, try brute-force for small n
    if (n < 1000000n) {
      for (let m1 = 0n; m1 < n; m1++) {
        const m2 = (a * m1 + b) % n;
        if (crypto.encrypt(m1, publicKey) === ciphertext1 && crypto.encrypt(m2, publicKey) === ciphertext2) {
          return m1;
        }
      }
    }
    
    throw new Error('Franklin-Reiter attack failed: No solution found');
  } else if (e === 2n) {
    // For e=2, we can solve directly
    for (let m1 = 0n; m1 < n; m1++) {
      const m2 = (a * m1 + b) % n;
      if (crypto.encrypt(m1, publicKey) === ciphertext1 && crypto.encrypt(m2, publicKey) === ciphertext2) {
        return m1;
      }
    }
    throw new Error('Franklin-Reiter attack failed: No solution found');
  } else {
    // For general e, we need to implement polynomial GCD for higher degrees
    // For demonstration, we'll use brute-force for small n
    if (n < 1000000n) {
      for (let m1 = 0n; m1 < n; m1++) {
        const m2 = (a * m1 + b) % n;
        if (crypto.encrypt(m1, publicKey) === ciphertext1 && crypto.encrypt(m2, publicKey) === ciphertext2) {
          return m1;
        }
      }
    }
    throw new Error('Franklin-Reiter attack for e > 3 requires polynomial GCD implementation');
  }
};

/**
 * Boneh-Durfee attack (small private exponent)
 * @param publicKey Public key
 * @returns Private key if found
 */
export const bonehDurfee = (publicKey: RSAPublicKey): RSAPrivateKey | null => {
  const { n, e } = publicKey;
  
  // Boneh-Durfee attack implementation
  // This implementation uses a combination of methods to find small private exponents
  
  // First, try Wiener's attack as a baseline
  const wienerResult = wiener(publicKey);
  if (wienerResult) {
    return wienerResult;
  }
  
  // Try to factor n using trial division (for small factors)
  const trialResult = trialDivision(n);
  if (trialResult) {
    const { p, q } = trialResult;
    const phi = (p - 1n) * (q - 1n);
    try {
      const d = modInv(e, phi);
      return { d, n };
    } catch (error) {
      // Skip if modInv fails
    }
  }
  
  // Try to find d using the fact that d < n^0.25 (Boneh-Durfee bound)
  // This is a simplified implementation of the lattice-based method
  const nBits = n.toString(2).length;
  const maxDBits = Math.floor(0.25 * nBits);
  const maxD = 2n ** BigInt(maxDBits);
  
  // Precompute test message and its encryption for faster verification
  const testMessage = 2n;
  const encryptedTestMessage = bigintCryptoUtils.modPow(testMessage, e, n);
  
  // Use a more efficient search strategy than brute-force
  // We'll use the fact that e*d ≡ 1 mod φ(n), so e*d = 1 + k*φ(n) for some k
  // And since φ(n) ≈ n, we have k ≈ (e*d)/n
  
  // Try different values of k and solve for d
  const maxK = 1000n;
  for (let k = 1n; k < maxK; k++) {
    // Calculate possible d using d ≈ (1 + k*n)/e
    const candidateD = (1n + k * n) / e;
    
    // Check if candidateD is integer
    if ((1n + k * n) % e !== 0n) {
      continue;
    }
    
    // Check if candidateD is within reasonable bounds
    if (candidateD < 1n || candidateD > maxD) {
      continue;
    }
    
    // Verify if candidateD is the private exponent
    try {
      const decryptedMessage = bigintCryptoUtils.modPow(encryptedTestMessage, candidateD, n);
      if (decryptedMessage === testMessage) {
        return { d: candidateD, n };
      }
    } catch (error) {
      // Skip if modPow fails
      continue;
    }
  }
  
  // Try another approach: use the continued fraction expansion
  // to find good approximations of d/n
  const cf = continuedFraction(e, n);
  const convs = convergents(cf);
  
  for (const { k, d } of convs) {
    if (k === 0n || d === 0n) continue;
    
    // Check if d is within reasonable bounds
    if (d > maxD) continue;
    
    try {
      const decryptedMessage = bigintCryptoUtils.modPow(encryptedTestMessage, d, n);
      if (decryptedMessage === testMessage) {
        return { d, n };
      }
    } catch (error) {
      continue;
    }
  }
  
  return null;
};

/**
 * Coppersmith's attack (small roots of polynomials modulo n)
 * @param n Modulus
 * @param polynomial Polynomial function
 * @param beta Beta parameter (0 < beta < 1), indicates the size of the root
 * @returns Small root if found
 */
export const coppersmith = (n: bigint, polynomial: (x: bigint) => bigint, beta: number): bigint | null => {
  // Coppersmith's attack implementation
  // This is a simplified version that works for certain cases
  
  // Calculate the maximum root size to search for
  const nBits = n.toString(2).length;
  const maxRootSize = Math.floor(beta * nBits);
  const maxRoot = 2n ** BigInt(maxRootSize);
  
  // Brute-force search for small roots
  // This is a simplified approach for demonstration
  // In a real implementation, we would use the lattice-based method
  for (let x = 0n; x < maxRoot; x++) {
    if (polynomial(x) % n === 0n) {
      return x;
    }
  }
  
  // Try another approach: use the fact that if x is small,
  // then polynomial(x) is small compared to n
  // So we can try to factor polynomial(x) and see if any factor divides n
  for (let x = 0n; x < maxRoot; x++) {
    const polyValue = polynomial(x);
    if (polyValue === 0n) {
      return x;
    }
    const g = gcd(polyValue, n);
    if (g > 1n && g < n) {
      // We found a factor of n, which can be useful in other attacks
      console.log(`Coppersmith's attack found factor of n: ${g}`);
    }
  }
  
  return null;
};

/**
 * Coppersmith's attack for factoring with partial information
 * @param n Modulus
 * @param knownBits Number of known bits of p
 * @param knownPart Known part of p (least significant bits)
 * @returns Factors if found
 */
export const coppersmithFactor = (n: bigint, knownBits: number, knownPart: bigint): { p: bigint; q: bigint } | null => {
  // Coppersmith's attack for factoring when part of p is known
  const maxRoot = 2n ** BigInt(knownBits);
  
  // Try different values for the unknown part of p
  for (let x = 0n; x < maxRoot; x++) {
    const p = (x << BigInt(knownPart.toString(2).length)) | knownPart;
    if (n % p === 0n) {
      return { p, q: n / p };
    }
  }
  
  return null;
};

/**
 * RSA-CRT fault injection attack
 * @param correctCiphertext Correctly decrypted ciphertext
 * @param faultyCiphertext Faulty decrypted ciphertext
 * @param publicKey Public key
 * @returns Factors if found
 */
export const rsaCrtFaultAttack = (correctCiphertext: bigint, faultyCiphertext: bigint, publicKey: RSAPublicKey): { p: bigint; q: bigint } | null => {
  // RSA-CRT fault injection attack
  // Based on the paper "Fault Analysis of RSA with the Chinese Remainder Theorem"
  const { n } = publicKey;
  
  // Calculate the difference between correct and faulty ciphertext
  const diff = correctCiphertext - faultyCiphertext;
  
  // The GCD of the difference and n should give us one of the factors
  const g = gcd(diff, n);
  
  if (g > 1n && g < n) {
    return { p: g, q: n / g };
  }
  
  return null;
};

/**
 * Franklin-Reiter related message attack (improved version)
 * @param ciphertext1 First ciphertext
 * @param ciphertext2 Second ciphertext
 * @param publicKey Public key
 * @param a Coefficient of linear function f(x) = a*x + b
 * @param b Constant of linear function f(x) = a*x + b
 * @returns Decrypted message
 */
export const franklinReiterImproved = (
  ciphertext1: bigint,
  ciphertext2: bigint,
  publicKey: RSAPublicKey,
  a: bigint,
  b: bigint
): bigint => {
  const { n, e } = publicKey;
  
  // Improved implementation of Franklin-Reiter attack
  // Works for any e, not just e=3
  
  // Try brute-force for small n
  if (n < 1000000n) {
    for (let m1 = 0n; m1 < n; m1++) {
      const m2 = (a * m1 + b) % n;
      if (crypto.encrypt(m1, publicKey) === ciphertext1 && crypto.encrypt(m2, publicKey) === ciphertext2) {
        return m1;
      }
    }
  }
  
  // For larger n, use the polynomial method
  // This is a simplified implementation that works for e=3
  if (e === 3n) {
    // Expand (a*x + b)^3 - c2 = a^3 x^3 + 3a^2 b x^2 + 3ab^2 x + (b^3 - c2)
    // And x^3 - c1
    // We can use the extended Euclidean algorithm for polynomials modulo n
    
    // Coefficients of the first polynomial: x^3 - c1
    const poly1 = [1n, 0n, 0n, -ciphertext1 % n];
    
    // Coefficients of the second polynomial: a^3 x^3 + 3a^2 b x^2 + 3ab^2 x + (b^3 - c2)
    const a3 = (a * a * a) % n;
    const a2b3 = (3n * a * a * b) % n;
    const ab23 = (3n * a * b * b) % n;
    const b3c2 = (b * b * b - ciphertext2) % n;
    const poly2 = [a3, a2b3, ab23, b3c2];
    
    // Compute polynomial GCD using extended Euclidean algorithm
    const gcdPoly = polynomialGCD(poly1, poly2, n);
    
    // If GCD is linear (degree 1), extract the root
    if (gcdPoly.length === 2) {
      const [coeff1, coeff0] = gcdPoly;
      if (coeff1 !== 0n) {
        // Solve coeff1 * x + coeff0 ≡ 0 mod n
        const x = (-coeff0 * modInv(coeff1, n)) % n;
        return x < 0n ? x + n : x;
      }
    }
  }
  
  throw new Error('Franklin-Reiter attack failed: No solution found');
};

/**
 * RSA key generation weakness attack
 * @param publicKey Public key
 * @returns Factors if found
 */
export const rsaKeygenWeakness = (publicKey: RSAPublicKey): { p: bigint; q: bigint } | null => {
  const { n } = publicKey;
  
  // Check for common key generation weaknesses
  
  // 1. Check if n is a square
  const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));
  if (sqrtN * sqrtN === n) {
    return { p: sqrtN, q: sqrtN };
  }
  
  // 2. Check if p and q are too close
  // Using Fermat's factorization method
  let x = sqrtN + 1n;
  let y2 = x * x - n;
  let y = BigInt(Math.floor(Math.sqrt(Number(y2))));
  
  while (y * y !== y2) {
    x += 1n;
    y2 = x * x - n;
    y = BigInt(Math.floor(Math.sqrt(Number(y2))));
    
    // Stop if we've tried too many times
    if (x - sqrtN > 1000n) {
      break;
    }
  }
  
  if (y * y === y2) {
    const p = x + y;
    const q = x - y;
    if (p * q === n) {
      return { p, q };
    }
  }
  
  return null;
};

/**
 * Low-Exponent RSA with Chinese Remainder Theorem attack
 * @param ciphertext Ciphertext
 * @param publicKey Public key
 * @returns Decrypted message
 */
export const lowExponentCRT = (ciphertext: bigint, publicKey: RSAPublicKey): bigint | null => {
  const { n, e } = publicKey;
  
  // This attack works when e is small and the message is small
  // We use the fact that m^e < n, so we can just compute the eth root
  
  // Calculate the maximum possible message size
  const maxMessage = n ** (1n / e);
  
  // Try to find the eth root of the ciphertext
  let low = 0n;
  let high = n;
  
  while (low <= high) {
    const mid = (low + high) / 2n;
    const mide = bigintCryptoUtils.modPow(mid, e, n);
    
    if (mide === ciphertext) {
      return mid;
    } else if (mide < ciphertext) {
      low = mid + 1n;
    } else {
      high = mid - 1n;
    }
  }
  
  // Try another approach: use Math.pow for small e
  if (e === 3n) {
    const m = BigInt(Math.floor(Math.cbrt(Number(ciphertext))));
    for (let delta = -5n; delta <= 5n; delta++) {
      const candidate = m + delta;
      if (candidate < 0n) continue;
      if (bigintCryptoUtils.modPow(candidate, e, n) === ciphertext) {
        return candidate;
      }
    }
  } else if (e === 2n) {
    // For e=2, use square root
    const m = BigInt(Math.floor(Math.sqrt(Number(ciphertext))));
    for (let delta = -5n; delta <= 5n; delta++) {
      const candidate = m + delta;
      if (candidate < 0n) continue;
      if (bigintCryptoUtils.modPow(candidate, e, n) === ciphertext) {
        return candidate;
      }
    }
  }
  
  return null;
};

/**
 * RSA with Prime Power Modulus attack
 * @param publicKey Public key
 * @returns Factors if found
 */
export const primePowerModulus = (publicKey: RSAPublicKey): { p: bigint; q: bigint } | null => {
  const { n } = publicKey;
  
  // This attack works when n is a prime power (p^k)
  // We can use Pollard's Rho algorithm or trial division to find p
  
  // Try trial division for small exponents
  for (let k = 2; k <= 10; k++) {
    const p = BigInt(Math.floor(Math.pow(Number(n), 1 / k)));
    
    // Check nearby values
    for (let delta = -5n; delta <= 5n; delta++) {
      const candidate = p + delta;
      if (candidate < 2n) continue;
      
      // Check if candidate^k === n
      let power = 1n;
      for (let i = 0; i < k; i++) {
        power *= candidate;
        if (power > n) break;
      }
      
      if (power === n) {
        return { p: candidate, q: candidate };
      }
    }
  }
  
  return null;
};

/**
 * Multi-prime RSA attack
 * @param publicKey Public key
 * @returns Factors if found
 */
export const multiPrimeRSA = (publicKey: RSAPublicKey): { p: bigint; q: bigint } | null => {
  const { n, e } = publicKey;
  
  // This attack works when n is a product of more than two primes
  // We can use the fact that φ(n) is easier to factor in this case
  
  // Try to factor n using trial division
  const trialResult = trialDivision(n);
  if (trialResult) {
    return trialResult;
  }
  
  // Try to find small factors using Pollard's Rho algorithm
  try {
    const factors = pollardsRho(n);
    if (factors.length >= 2) {
      const p = factors[0];
      const q = n / p;
      return { p, q };
    }
  } catch (error) {
    // Skip if Pollard's Rho fails
  }
  
  return null;
};

/**
 * Factor n using known p and q
 * @param n Modulus
 * @param p Prime factor
 * @param q Prime factor
 * @returns Factors
 */
export const factorKnownPrimes = (n: bigint, p: bigint, q: bigint): FactorResult => {
  if (p * q !== n) {
    throw new Error('p and q are not factors of n');
  }
  
  return { p, q };
};

/**
 * Calculate private key from factors
 * @param p Prime factor
 * @param q Prime factor
 * @param e Public exponent
 * @returns Private key
 */
export const privateKeyFromFactors = (p: bigint, q: bigint, e: bigint): RSAPrivateKey => {
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const d = bigintCryptoUtils.modInv(e, phi);
  
  return { d, n };
};

/**
 * Try to factor n using trial division (for small factors)
 * @param n Modulus
 * @returns Factors if found, null otherwise
 */
export const trialDivision = (n: bigint): FactorResult | null => {
  // Trial division for small factors
  const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  
  for (const prime of smallPrimes) {
    if (n % prime === 0n) {
      const p = prime;
      const q = n / prime;
      return { p, q };
    }
  }
  
  // Try even numbers
  if (n % 2n === 0n) {
    return { p: 2n, q: n / 2n };
  }
  
  // Try numbers ending with 5
  if (n % 5n === 0n) {
    return { p: 5n, q: n / 5n };
  }
  
  return null;
};

/**
 * RSA factoring with known Euler's totient function
 * @param n Modulus
 * @param phi Euler's totient function of n
 * @returns Factors if found
 */
export const factorWithKnownPhi = (n: bigint, phi: bigint): { p: bigint; q: bigint } | null => {
  // When phi(n) is known, we can factor n by solving p + q = n - phi(n) + 1
  // and p * q = n
  const sum = n - phi + 1n;
  const discriminant = sum * sum - 4n * n;
  
  // Calculate square root of discriminant
  let sqrtDiscriminant = BigInt(Math.floor(Math.sqrt(Number(discriminant))));
  
  // Check if discriminant is a perfect square
  if (sqrtDiscriminant * sqrtDiscriminant !== discriminant) {
    // Try nearby values
    for (let delta = -5n; delta <= 5n; delta++) {
      const candidate = sqrtDiscriminant + delta;
      if (candidate * candidate === discriminant) {
        sqrtDiscriminant = candidate;
        break;
      }
    }
    
    // If still not a perfect square, return null
    if (sqrtDiscriminant * sqrtDiscriminant !== discriminant) {
      return null;
    }
  }
  
  // Calculate p and q
  const p = (sum + sqrtDiscriminant) / 2n;
  const q = (sum - sqrtDiscriminant) / 2n;
  
  // Verify the factors
  if (p * q === n) {
    return { p, q };
  }
  
  return null;
};

/**
 * RSA CRT implementation error attack
 * @param publicKey Public key
 * @param faultySignatures Array of faulty signatures
 * @param messages Array of messages that were signed
 * @returns Private key if found
 */
export const rsaCrtImplementationError = (publicKey: RSAPublicKey, faultySignatures: bigint[], messages: bigint[]): RSAPrivateKey | null => {
  const { n, e } = publicKey;
  
  if (faultySignatures.length !== messages.length || faultySignatures.length < 2) {
    throw new Error('Need at least two faulty signatures and corresponding messages');
  }
  
  // Try to find factors using pairs of faulty signatures
  for (let i = 0; i < faultySignatures.length; i++) {
    for (let j = i + 1; j < faultySignatures.length; j++) {
      const s1 = faultySignatures[i];
      const s2 = faultySignatures[j];
      const m1 = messages[i];
      const m2 = messages[j];
      
      // Check if s1^e ≡ m1 mod p and s2^e ≡ m2 mod q
      // We can find p by computing gcd(s1^e - m1, n)
      try {
        const s1e = bigintCryptoUtils.modPow(s1, e, n);
        const p = gcd(s1e - m1, n);
        
        if (p > 1n && p < n) {
          const q = n / p;
          const phi = (p - 1n) * (q - 1n);
          const d = modInv(e, phi);
          return { d, n };
        }
        
        const s2e = bigintCryptoUtils.modPow(s2, e, n);
        const q = gcd(s2e - m2, n);
        
        if (q > 1n && q < n) {
          const p = n / q;
          const phi = (p - 1n) * (q - 1n);
          const d = modInv(e, phi);
          return { d, n };
        }
      } catch (error) {
        // Skip if modPow fails
        continue;
      }
    }
  }
  
  return null;
};

/**
 * RSA low public exponent with related messages attack
 * @param ciphertexts Array of ciphertexts
 * @param publicKey Public key
 * @param polynomials Array of polynomials relating the messages
 * @returns Decrypted messages if found
 */
export const lowExponentRelatedMessages = (ciphertexts: bigint[], publicKey: RSAPublicKey, polynomials: ((...msgs: bigint[]) => bigint)[]): bigint[] | null => {
  const { n, e } = publicKey;
  
  if (e !== 3n) {
    throw new Error('This attack requires e=3');
  }
  
  if (ciphertexts.length < 2) {
    throw new Error('Need at least two ciphertexts');
  }
  
  // This is a simplified implementation for demonstration
  // A real implementation would use lattice-based methods
  
  // Try brute-force for small n
  if (n < 1000000n) {
    for (let m1 = 0n; m1 < n; m1++) {
      for (let m2 = 0n; m2 < n; m2++) {
        // Check if both messages decrypt correctly
        const c1 = bigintCryptoUtils.modPow(m1, e, n);
        const c2 = bigintCryptoUtils.modPow(m2, e, n);
        
        if (c1 === ciphertexts[0] && c2 === ciphertexts[1]) {
          // Check if they satisfy the polynomial relation
          if (polynomials.length > 0) {
            const polyResult = polynomials[0](m1, m2);
            if (polyResult !== 0n) {
              continue;
            }
          }
          return [m1, m2];
        }
      }
    }
  }
  
  return null;
};

/**
 * RSA common prime attack
 * @param publicKey1 First public key
 * @param publicKey2 Second public key
 * @returns Shared prime factor if found
 */
export const commonPrimeAttack = (publicKey1: RSAPublicKey, publicKey2: RSAPublicKey): bigint | null => {
  const { n: n1 } = publicKey1;
  const { n: n2 } = publicKey2;
  
  // Compute GCD of the two moduli
  const commonFactor = gcd(n1, n2);
  
  if (commonFactor > 1n && commonFactor < n1 && commonFactor < n2) {
    return commonFactor;
  }
  
  return null;
};

/**
 * RSA fault injection on private key attack
 * @param correctSignatures Array of correct signatures
 * @param faultySignatures Array of faulty signatures
 * @param messages Array of messages that were signed
 * @param publicKey Public key
 * @returns Private key if found
 */
export const rsaPrivateKeyFaultInjection = (
  correctSignatures: bigint[],
  faultySignatures: bigint[],
  messages: bigint[],
  publicKey: RSAPublicKey
): RSAPrivateKey | null => {
  const { n, e } = publicKey;
  
  if (correctSignatures.length !== faultySignatures.length || correctSignatures.length !== messages.length) {
    throw new Error('Arrays must have the same length');
  }
  
  if (correctSignatures.length === 0) {
    throw new Error('Need at least one signature pair');
  }
  
  // Try to find factors using each pair of correct and faulty signatures
  for (let i = 0; i < correctSignatures.length; i++) {
    const s = correctSignatures[i];
    const sFaulty = faultySignatures[i];
    const m = messages[i];
    
    // Compute the difference between correct and faulty signature
    const diff = s - sFaulty;
    
    // The GCD of the difference and n should give us one of the factors
    const p = gcd(diff, n);
    
    if (p > 1n && p < n) {
      const q = n / p;
      const phi = (p - 1n) * (q - 1n);
      try {
        const d = modInv(e, phi);
        return { d, n };
      } catch (error) {
        // Skip if modInv fails
        continue;
      }
    }
  }
  
  return null;
};

/**
 * Common RSA attacks
 */
export const attacks = {
  smallExponent,
  commonModulus,
  wiener,
  hastadBroadcast,
  franklinReiter,
  franklinReiterImproved,
  bonehDurfee,
  coppersmith,
  coppersmithFactor,
  rsaCrtFaultAttack,
  rsaKeygenWeakness,
  lowExponentCRT,
  primePowerModulus,
  multiPrimeRSA,
  factorKnownPrimes,
  privateKeyFromFactors,
  trialDivision,
  factorWithKnownPhi,
  rsaCrtImplementationError,
  lowExponentRelatedMessages,
  commonPrimeAttack,
  rsaPrivateKeyFaultInjection
};

