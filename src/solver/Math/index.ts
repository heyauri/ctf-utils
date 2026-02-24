/**
 * Math utilities for CTF challenges
 */

import * as crypto from 'crypto';

/**
 * Linear algebra utilities
 */

/**
 * Matrix multiplication
 * @param a First matrix
 * @param b Second matrix
 * @returns Product matrix
 */
const matrixMultiply = (a: number[][], b: number[][]): number[][] => {
  const aRows = a.length;
  const aCols = a[0].length;
  const bCols = b[0].length;
  
  if (aCols !== b.length) {
    throw new Error('Matrix dimensions do not match for multiplication');
  }
  
  const result: number[][] = Array(aRows).fill(0).map(() => Array(bCols).fill(0));
  
  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      for (let k = 0; k < aCols; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  
  return result;
};

/**
 * Matrix determinant calculation
 * @param matrix Input matrix
 * @returns Determinant value
 */
const matrixDeterminant = (matrix: number[][]): number => {
  const n = matrix.length;
  
  if (n === 1) {
    return matrix[0][0];
  }
  
  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }
  
  let det = 0;
  for (let i = 0; i < n; i++) {
    const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
    det += matrix[0][i] * Math.pow(-1, i) * matrixDeterminant(minor);
  }
  
  return det;
};

/**
 * Matrix inverse calculation (Gaussian elimination)
 * @param matrix Input matrix
 * @returns Inverse matrix
 */
const matrixInverse = (matrix: number[][]): number[][] => {
  const n = matrix.length;
  
  // Create augmented matrix [matrix | identity]
  const augmented: number[][] = Array(n).fill(0).map((_, i) => {
    const row = [...matrix[i]];
    for (let j = 0; j < n; j++) {
      row.push(i === j ? 1 : 0);
    }
    return row;
  });
  
  // Gaussian elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let pivot = i;
    for (let j = i; j < n; j++) {
      if (Math.abs(augmented[j][i]) > Math.abs(augmented[pivot][i])) {
        pivot = j;
      }
    }
    
    // Swap rows
    [augmented[i], augmented[pivot]] = [augmented[pivot], augmented[i]];
    
    // Normalize pivot row
    const pivotValue = augmented[i][i];
    if (pivotValue === 0) {
      throw new Error('Matrix is singular and cannot be inverted');
    }
    for (let j = i; j < 2 * n; j++) {
      augmented[i][j] /= pivotValue;
    }
    
    // Eliminate other rows
    for (let j = 0; j < n; j++) {
      if (j !== i) {
        const factor = augmented[j][i];
        for (let k = i; k < 2 * n; k++) {
          augmented[j][k] -= factor * augmented[i][k];
        }
      }
    }
  }
  
  // Extract inverse matrix
  const inverse: number[][] = Array(n).fill(0).map((_, i) => augmented[i].slice(n));
  
  return inverse;
};

/**
 * Number theory utilities
 */

/**
 * Greatest common divisor
 * @param a First number
 * @param b Second number
 * @returns GCD of a and b
 */
const gcd = (a: bigint, b: bigint): bigint => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  
  while (b !== 0n) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  
  return a;
};

/**
 * Least common multiple
 * @param a First number
 * @param b Second number
 * @returns LCM of a and b
 */
const lcm = (a: bigint, b: bigint): bigint => {
  return (a * b) / gcd(a, b);
};

/**
 * Extended Euclidean algorithm
 * @param a First number
 * @param b Second number
 * @returns [gcd, x, y] where ax + by = gcd(a, b)
 */
const extendedGcd = (a: bigint, b: bigint): [bigint, bigint, bigint] => {
  if (b === 0n) {
    return [a, 1n, 0n];
  }
  
  const [g, x, y] = extendedGcd(b, a % b);
  return [g, y, x - (a / b) * y];
};

/**
 * Modular inverse
 * @param a Number to find inverse for
 * @param m Modulus
 * @returns Modular inverse or throws error if no inverse exists
 */
const modInverse = (a: bigint, m: bigint): bigint => {
  const [g, x] = extendedGcd(a, m);
  if (g !== 1n) {
    throw new Error('Modular inverse does not exist');
  }
  return (x % m + m) % m;
};

/**
 * Solve linear congruence equation ax ≡ b mod m
 * @param a Coefficient
 * @param b Constant term
 * @param m Modulus
 * @returns Solution x or throws error if no solution exists
 */
const solveLinearCongruence = (a: bigint, b: bigint, m: bigint): bigint => {
  const g = gcd(a, m);
  
  if (b % g !== 0n) {
    throw new Error('No solution exists');
  }
  
  const a1 = a / g;
  const b1 = b / g;
  const m1 = m / g;
  
  const x0 = (modInverse(a1, m1) * b1) % m1;
  return (x0 + m1) % m1;
};

/**
 * Solve system of linear congruences using Chinese Remainder Theorem
 * @param congruences Array of [a, m] where x ≡ a mod m
 * @returns Solution x or throws error if no solution exists
 */
const solveCRT = (congruences: Array<[bigint, bigint]>): bigint => {
  let x = 0n;
  let M = 1n;
  
  for (const [a, m] of congruences) {
    M *= m;
  }
  
  for (const [a, m] of congruences) {
    const Mi = M / m;
    const MiInv = modInverse(Mi, m);
    x += a * Mi * MiInv;
  }
  
  return x % M;
};

/**
 * Primality test using Miller-Rabin algorithm
 * @param n Number to test
 * @param k Number of rounds (default: 10)
 * @returns True if n is probably prime, false otherwise
 */
const isPrime = (n: bigint, k: number = 10): boolean => {
  if (n <= 1n) return false;
  if (n <= 3n) return true;
  if (n % 2n === 0n) return false;
  
  // Write n-1 as d * 2^s
  let d = n - 1n;
  let s = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    s += 1n;
  }
  
  // Test for k rounds
  for (let i = 0; i < k; i++) {
    // Generate random bigint without converting to Number
    const a = 2n + randomBigintRange(1n, n - 3n);
    let x = modPow(a, d, n);
    
    if (x === 1n || x === n - 1n) continue;
    
    let isProbablyPrime = false;
    for (let j = 0n; j < s - 1n; j++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) {
        isProbablyPrime = true;
        break;
      }
    }
    
    if (!isProbablyPrime) {
      return false;
    }
  }
  
  return true;
};

/**
 * Generate random bigint in range [min, max]
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Random bigint in range
 */
const randomBigintRange = (min: bigint, max: bigint): bigint => {
  const range = max - min + 1n;
  const bits = range.toString(2).length;
  const bytes = Math.ceil(bits / 8);
  
  let result: bigint;
  do {
    const randomBytes = crypto.randomBytes(bytes);
    result = 0n;
    for (let i = 0; i < bytes; i++) {
      result = (result << 8n) + BigInt(randomBytes[i]);
    }
  } while (result >= range);
  
  return min + result;
};

/**
 * Modular exponentiation using binary exponentiation
 * @param base Base
 * @param exponent Exponent
 * @param modulus Modulus
 * @returns (base^exponent) mod modulus
 */
const modPow = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
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
 * Factorize number using trial division
 * @param n Number to factorize
 * @returns Array of prime factors
 */
const factorize = (n: bigint): bigint[] => {
  const factors: bigint[] = [];
  
  // Check for 2
  while (n % 2n === 0n) {
    factors.push(2n);
    n /= 2n;
  }
  
  // Check for odd factors
  for (let i = 3n; i * i <= n; i += 2n) {
    while (n % i === 0n) {
      factors.push(i);
      n /= i;
    }
  }
  
  // If n is a prime number greater than 2
  if (n > 2n) {
    factors.push(n);
  }
  
  return factors;
};

/**
 * Factorize number using Pollard's Rho algorithm (faster for large numbers)
 * @param n Number to factorize
 * @returns Array of prime factors
 */
const pollardsRho = (n: bigint): bigint[] => {
  const factors: bigint[] = [];
  
  const pollardsRhoHelper = (n: bigint): bigint => {
    if (n % 2n === 0n) return 2n;
    if (n % 3n === 0n) return 3n;
    if (n % 5n === 0n) return 5n;
    
    // 如果 n 是质数，直接返回 n，避免不必要的计算
    if (isPrime(n)) return n;
    
    const f = (x: bigint, c: bigint, n: bigint) => {
      return (modPow(x, 2n, n) + c) % n;
    };
    
    // 限制最大迭代次数，避免无限循环
    const maxIterations = 10000n;
    
    for (let c = 1n; c < maxIterations; c++) {
      let x = 2n;
      let y = 2n;
      let d = 1n;
      let iteration = 0n; // 为每个 c 值重置迭代计数器
      
      while (d === 1n && iteration < maxIterations) {
        x = f(x, c, n);
        y = f(f(y, c, n), c, n);
        d = gcd(x > y ? x - y : y - x, n);
        iteration++;
        
        // 检查是否陷入循环（x 和 y 相等）
        if (x === y) {
          break;
        }
      }
      
      // 如果找到非平凡因子，返回它
      if (d > 1n && d < n) {
        return d;
      }
    }
    
    // 如果所有方法都失败，返回 n（可能是质数）
    return n;
  };
  
  // 使用迭代而不是递归，避免栈溢出
  const factorHelper = (n: bigint) => {
    const stack: bigint[] = [n];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (current === 1n) continue;
      if (isPrime(current)) {
        factors.push(current);
        continue;
      }
      
      let d = pollardsRhoHelper(current);
      stack.push(d);
      stack.push(current / d);
    }
  };
  
  factorHelper(n);
  return factors.sort((a, b) => a > b ? 1 : -1);
};

/**
 * Calculate Euler's totient function φ(n)
 * @param n Number
 * @returns Euler's totient function value
 */
const eulerTotient = (n: bigint): bigint => {
  if (n === 0n) return 0n;
  if (n === 1n) return 1n;
  
  const factors = factorize(n);
  const uniqueFactors = Array.from(new Set(factors));
  
  let result = n;
  for (const p of uniqueFactors) {
    result = result / p * (p - 1n);
  }
  
  return result;
};

/**
 * Calculate Möbius function μ(n)
 * @param n Number
 * @returns Möbius function value (-1, 0, or 1)
 */
const mobiusFunction = (n: bigint): number => {
  if (n === 1n) return 1;
  
  const factors = factorize(n);
  const uniqueFactors = new Set(factors);
  
  // Check if n has any squared prime factors
  for (const p of uniqueFactors) {
    if (n % (p * p) === 0n) {
      return 0;
    }
  }
  
  // Number of distinct prime factors
  const k = uniqueFactors.size;
  return k % 2 === 0 ? 1 : -1;
};

/**
 * Find primitive root modulo p
 * @param p Prime modulus
 * @returns Primitive root modulo p
 */
const findPrimitiveRoot = (p: bigint): bigint => {
  if (!isPrime(p)) {
    throw new Error('p must be prime');
  }
  
  if (p === 2n) return 1n;
  if (p === 3n) return 2n;
  
  // Factorize p-1
  const phi = p - 1n;
  const factors = Array.from(new Set(factorize(phi)));
  
  // Check each candidate
  for (let g = 2n; g < p; g++) {
    let isPrimitive = true;
    
    for (const f of factors) {
      if (modPow(g, phi / f, p) === 1n) {
        isPrimitive = false;
        break;
      }
    }
    
    if (isPrimitive) {
      return g;
    }
  }
  
  throw new Error('No primitive root found');
};

/**
 * Combination utilities
 */

/**
 * Calculate binomial coefficient C(n, k)
 * @param n Total number of items
 * @param k Number of items to choose
 * @returns Binomial coefficient
 */
const binomialCoefficient = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  k = Math.min(k, n - k); // Take advantage of symmetry
  let result = 1;
  
  for (let i = 1; i <= k; i++) {
    result = result * (n - k + i) / i;
  }
  
  return result;
};

/**
 * Generate all permutations of an array
 * @param arr Input array
 * @returns Array of permutations
 */
const generatePermutations = <T>(arr: T[]): T[][] => {
  if (arr.length === 0) return [[]];
  if (arr.length === 1) return [arr];
  
  const result: T[][] = [];
  
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const permutations = generatePermutations(remaining);
    
    for (const perm of permutations) {
      result.push([current, ...perm]);
    }
  }
  
  return result;
};

/**
 * Generate all combinations of an array
 * @param arr Input array
 * @param k Size of each combination
 * @returns Array of combinations
 */
const generateCombinations = <T>(arr: T[], k: number): T[][] => {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  
  const result: T[][] = [];
  
  const backtrack = (start: number, current: T[]) => {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  };
  
  backtrack(0, []);
  return result;
};

/**
 * Generate all subsets of an array
 * @param arr Input array
 * @returns Array of subsets
 */
const generateSubsets = <T>(arr: T[]): T[][] => {
  const result: T[][] = [[]];
  
  for (const item of arr) {
    const newSubsets = result.map(subset => [...subset, item]);
    result.push(...newSubsets);
  }
  
  return result;
};

/**
 * Miscellaneous math utilities
 */

/**
 * Calculate discrete logarithm using baby-step giant-step algorithm
 * @param g Base
 * @param h Result
 * @param p Modulus
 * @returns Discrete logarithm x where g^x ≡ h mod p
 */
const discreteLogarithm = (g: bigint, h: bigint, p: bigint): bigint => {
  const m = BigInt(Math.ceil(Math.sqrt(Number(p - 1n)))) + 1n;
  
  // Baby steps
  const babySteps = new Map<bigint, bigint>();
  let current = 1n;
  
  for (let j = 0n; j < m; j++) {
    babySteps.set(current, j);
    current = (current * g) % p;
  }
  
  // Precompute giant step factor
  const factor = modPow(g, m * (p - 2n), p);
  current = h;
  
  // Giant steps
  for (let i = 0n; i < m; i++) {
    if (babySteps.has(current)) {
      return i * m + babySteps.get(current)!;
    }
    current = (current * factor) % p;
  }
  
  throw new Error('Discrete logarithm not found');
};

/**
 * Calculate Legendre symbol (a|p)
 * @param a Number
 * @param p Prime modulus
 * @returns Legendre symbol value (1, -1, or 0)
 */
const legendreSymbol = (a: bigint, p: bigint): number => {
  if (a === 0n) return 0;
  if (a === 1n) return 1;
  
  let a1 = a;
  let e = 0n;
  
  // Write a as 2^e * a1
  while (a1 % 2n === 0n) {
    a1 /= 2n;
    e += 1n;
  }
  
  let s = 1;
  
  // Quadratic reciprocity
  if (e % 2n === 1n) {
    const pMod8 = p % 8n;
    if (pMod8 === 3n || pMod8 === 5n) {
      s = -s;
    }
  }
  
  if (a1 !== 1n) {
    if (p % 4n === 3n && a1 % 4n === 3n) {
      s = -s;
    }
    s *= legendreSymbol(p % a1, a1);
  }
  
  return s;
};

/**
 * Solve quadratic congruence equation x^2 ≡ a mod p
 * @param a Number
 * @param p Prime modulus
 * @returns Solutions x or throws error if no solution exists
 */
const solveQuadraticCongruence = (a: bigint, p: bigint): [bigint, bigint] => {
  a = a % p;
  
  if (a === 0n) {
    return [0n, 0n];
  }
  
  if (legendreSymbol(a, p) !== 1) {
    throw new Error('No solution exists');
  }
  
  // Tonelli-Shanks algorithm
  if (p % 4n === 3n) {
    const x = modPow(a, (p + 1n) / 4n, p);
    return [x, p - x];
  }
  
  // Simplified implementation for demonstration
  // In a real implementation, you would implement the full Tonelli-Shanks algorithm
  throw new Error('Quadratic congruence solver not fully implemented for this case');
};

export {
  // Linear algebra
  matrixMultiply,
  matrixDeterminant,
  matrixInverse,
  
  // Number theory
  gcd,
  lcm,
  extendedGcd,
  modInverse,
  solveLinearCongruence,
  solveCRT,
  isPrime,
  modPow,
  factorize,
  pollardsRho,
  eulerTotient,
  mobiusFunction,
  findPrimitiveRoot,
  randomBigintRange,
  
  // Combinatorics
  binomialCoefficient,
  generatePermutations,
  generateCombinations,
  generateSubsets,
  
  // Miscellaneous
  discreteLogarithm,
  legendreSymbol,
  solveQuadraticCongruence
};
