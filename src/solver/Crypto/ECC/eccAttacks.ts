export interface Point {
  x: bigint;
  y: bigint;
}

export interface ECCKeyPair {
  privateKey: bigint;
  publicKey: Point;
}

export interface ECCParams {
  p?: bigint;
  a: bigint;
  b: bigint;
  G: Point;
  n: bigint;
}

const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
  let result = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e % 2n === 1n) {
      result = (result * b) % mod;
    }
    e = e / 2n;
    b = (b * b) % mod;
  }
  return result;
};

const modInverse = (a: bigint, m: bigint): bigint => {
  let m0 = m;
  let y = 0n;
  let x = 1n;
  if (m === 1n) return 0n;
  while (a > 1n) {
    let q = a / m;
    let t = m;
    m = a % m;
    a = t;
    t = y;
    y = x - q * y;
    x = t;
  }
  if (x < 0n) x += m0;
  return x;
};

const egcd = (a: bigint, b: bigint): [bigint, bigint, bigint] => {
  if (a === 0n) return [b, 0n, 1n];
  const [g, x1, y1] = egcd(b % a, a);
  const x = y1 - (b / a) * x1;
  const y = x1;
  return [g, x, y];
};

const gcd = (a: bigint, b: bigint): bigint => {
  while (b !== 0n) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
};

const modSqrt = (a: bigint, p: bigint): bigint | null => {
  if (p === 2n) return a;
  if (p % 4n === 3n) {
    const exp = (p + 1n) / 4n;
    const result = modPow(a, exp, p);
    if (modPow(result, 2n, p) === a) return result;
    return null;
  }
  
  const legendre = modPow(a, (p - 1n) / 2n, p);
  if (legendre === p - 1n) return null;
  
  let q = p - 1n;
  let s = 0n;
  while (q % 2n === 0n) {
    q = q / 2n;
    s += 1n;
  }
  
  let z = 2n;
  while (modPow(z, (p - 1n) / 2n, p) !== p - 1n) {
    z += 1n;
  }
  
  let c = modPow(z, q, p);
  let x = modPow(a, (q + 1n) / 2n, p);
  let t = modPow(a, q, p);
  let m = s;
  
  while (t !== 1n) {
    let i = 0n;
    let temp = t;
    while (temp !== 1n && i < m) {
      temp = modPow(temp, 2n, p);
      i += 1n;
    }
    if (i === m) return null;
    const power = modPow(c, 2n ** BigInt(Number(m) - Number(i) - 1), p);
    x = (x * power) % p;
    c = modPow(power, 2n, p);
    t = (t * c) % p;
    m = i;
  }
  
  return x;
};

export class ECC {
  private params: ECCParams;
  
  constructor(params: ECCParams) {
    this.params = params;
  }
  
  private isOnCurve(p: Point): boolean {
    const { a, b, p: mod } = this.params;
    if (!mod) return false;
    const left = modPow(p.y, 2n, mod);
    const right = (modPow(p.x, 3n, mod) + a * p.x + b) % mod;
    return left === right;
  }
  
  pointAdd(p1: Point, p2: Point): Point | null {
    const { a, p: mod } = this.params;
    if (!mod) return null;
    
    if (p1.x === 0n && p1.y === 0n) return p2;
    if (p2.x === 0n && p2.y === 0n) return p1;
    
    let lambda: bigint;
    if (p1.x === p2.x) {
      if (p1.y === p2.y) {
        const numerator = (3n * p1.x * p1.x + a) % mod;
        const denominator = modInverse(2n * p1.y, mod);
        lambda = (numerator * denominator) % mod;
      } else {
        return null;
      }
    } else {
      const numerator = (p2.y - p1.y) % mod;
      const denominator = modInverse(p2.x - p1.x, mod);
      lambda = (numerator * denominator) % mod;
    }
    
    const x3 = (lambda * lambda - p1.x - p2.x) % mod;
    const y3 = (lambda * (p1.x - x3) - p1.y) % mod;
    
    const result = { x: (x3 + mod) % mod, y: (y3 + mod) % mod };
    return result;
  }
  
  pointMultiply(k: bigint, P: Point): Point | null {
    let result: Point = { x: 0n, y: 0n };
    let base: Point = { ...P };
    
    while (k > 0n) {
      if (k % 2n === 1n) {
        const added = this.pointAdd(result, base);
        if (added) result = added;
      }
      const doubled = this.pointAdd(base, base);
      if (doubled) base = doubled;
      k = k / 2n;
    }
    
    return result;
  }
  
  getPublicKey(privateKey: bigint): Point | null {
    return this.pointMultiply(privateKey, this.params.G);
  }
  
  static generateKeyPair(params: ECCParams): ECCKeyPair {
    const ecc = new ECC(params);
    const privateKey = BigInt(Math.floor(Math.random() * Number(params.n)));
    const publicKey = ecc.getPublicKey(privateKey);
    if (!publicKey) throw new Error('Failed to generate public key');
    return { privateKey, publicKey };
  }
  
  static attackSmallPrivateKey(
    publicKey: Point,
    params: ECCParams,
    maxAttempts: number = 1000000
  ): bigint | null {
    const ecc = new ECC(params);
    for (let i = 1n; i < BigInt(maxAttempts); i++) {
      const point = ecc.pointMultiply(i, params.G);
      if (point && point.x === publicKey.x && point.y === publicKey.y) {
        return i;
      }
    }
    return null;
  }
  
  static attackSmartAttack(
    e1: Point,
    e2: Point,
    n1: bigint,
    n2: bigint,
    params: ECCParams
  ): bigint | null {
    const [gcdResult, s1, s2] = egcd(n1, n2);
    if (gcdResult !== 1n) return null;
    
    const ecc = new ECC(params);
    const p1 = ecc.pointMultiply(s1 * n2, e1);
    const p2 = ecc.pointMultiply(s2 * n1, e2);
    
    if (p1 && p2) {
      const sum = ecc.pointAdd(p1, p2);
      if (sum && sum.x === 0n && sum.y === 0n) {
        return null;
      }
      return sum?.x ?? null;
    }
    return null;
  }
  
  static pohligHellman(
    publicKey: Point,
    params: ECCParams,
    target: bigint
  ): bigint | null {
    const { n, G } = params;
    const factors = ECC.factorize(Number(n));
    
    let result = 0n;
    let cofactor = n;
    
    for (const [prime, exp] of factors) {
      const m = modPow(BigInt(prime), BigInt(exp), n);
      const subgroupResult = ECC.discreteLogInSubgroup(
        publicKey,
        G,
        prime,
        exp,
        params
      );
      
      if (subgroupResult === null) return null;
      
      result = result + subgroupResult * (cofactor / m);
      cofactor = cofactor / m;
    }
    
    return result;
  }
  
  private static factorize(n: number): [number, number][] {
    const factors: [number, number][] = [];
    let d = 2;
    while (d * d <= n) {
      let count = 0;
      while (n % d === 0) {
        n = Math.floor(n / d);
        count++;
      }
      if (count > 0) factors.push([d, count]);
      d++;
    }
    if (n > 1) factors.push([n, 1]);
    return factors;
  }
  
  private static discreteLogInSubgroup(
    publicKey: Point,
    G: Point,
    p: number,
    exp: number,
    params: ECCParams
  ): bigint | null {
    const ecc = new ECC(params);
    const m = Math.floor(Math.pow(p, exp / 2)) + 1;
    
    const table = new Map<string, bigint>();
    let current: Point = { ...G };
    for (let i = 0; i < m; i++) {
      const key = `${current.x},${current.y}`;
      if (!table.has(key)) {
        table.set(key, BigInt(i));
      }
      const next = ecc.pointAdd(current, G);
      if (next) current = next;
    }
    
    const factor = modInverse(BigInt(m), BigInt(p));
    const factorG = ecc.pointMultiply(factor, G);
    if (!factorG) return null;
    const factorPub = ecc.pointMultiply(factor, publicKey);
    
    if (!factorPub) return null;
    
    current = { ...factorPub };
    for (let i = 0; i < m; i++) {
      const key = `${current.x},${current.y}`;
      if (table.has(key)) {
        const j = table.get(key)!;
        return BigInt(i) * BigInt(m) + j;
      }
      const next = ecc.pointAdd(current, factorG);
      if (next) current = next;
    }
    
    return null;
  }
}

export class DSA {
  static generateKeyPair(p: bigint, q: bigint, g: bigint): { x: bigint; y: bigint } {
    const x = BigInt(Math.floor(Math.random() * Number(q))) + 1n;
    const y = modPow(g, x, p);
    return { x, y };
  }
  
  static sign(message: bigint, p: bigint, q: bigint, g: bigint, x: bigint): { r: bigint; s: bigint } | null {
    const k = BigInt(Math.floor(Math.random() * Number(q))) + 1n;
    const r = modPow(g, k, p) % q;
    if (r === 0n) return null;
    
    const kInv = modInverse(k, q);
    const s = (kInv * (message + x * r)) % q;
    if (s === 0n) return null;
    
    return { r, s };
  }
  
  static verify(message: bigint, signature: { r: bigint; s: bigint }, p: bigint, q: bigint, g: bigint, y: bigint): boolean {
    const { r, s } = signature;
    
    if (r <= 0n || r >= q || s <= 0n || s >= q) return false;
    
    const w = modInverse(s, q);
    const u1 = (message * w) % q;
    const u2 = (r * w) % q;
    
    const v = ((modPow(g, u1, p) * modPow(y, u2, p)) % p) % q;
    
    return v === r;
  }
  
  static attackKnownHighBits(
    p: bigint,
    q: bigint,
    g: bigint,
    y: bigint,
    message: bigint,
    signature: { r: bigint; s: bigint },
    knownBits: number
  ): bigint | null {
    const { r, s } = signature;
    const kUpper = 1n << BigInt(knownBits);
    
    for (let k = 1n; k < kUpper; k++) {
      const sInv = modInverse(s, q);
      if (sInv === 0n) continue;
      
      const xTry = ((sInv * (message - k * r)) % q + q) % q;
      const yTry = modPow(g, xTry, p);
      
      if (yTry === y) {
        return xTry;
      }
    }
    
    return null;
  }
  
  static attackRepeatedK(
    signatures: Array<{ r: bigint; s: bigint; message: bigint }>,
    p: bigint,
    q: bigint
  ): bigint | null {
    if (signatures.length < 2) return null;
    
    for (let i = 0; i < signatures.length; i++) {
      for (let j = i + 1; j < signatures.length; j++) {
        const s1 = signatures[i].s;
        const s2 = signatures[j].s;
        const m1 = signatures[i].message;
        const m2 = signatures[j].message;
        
        const diffS = s1 - s2;
        if (diffS === 0n) continue;
        
        const diffM = m1 - m2;
        const k = (diffM * modInverse(diffS, q)) % q;
        
        const r = signatures[i].r;
        const kInv = modInverse(k, q);
        const x1 = ((s1 * k - m1) * modInverse(r, q)) % q;
        
        let valid = true;
        for (const sig of signatures) {
          const expectedS = (modInverse(k, q) * (sig.message + x1 * sig.r)) % q;
          if (expectedS !== sig.s) {
            valid = false;
            break;
          }
        }
        
        if (valid) return x1;
      }
    }
    
    return null;
  }
}

export class PRNG {
  static crackLCG(
    outputs: bigint[],
    modulus: bigint,
    multiplier: bigint,
    increment: bigint
  ): bigint | null {
    if (outputs.length < 3) return null;
    
    const state = outputs[0];
    return state;
  }
  
  static detectMT19937(seeds: number[]): { seed: number; valid: boolean } {
    const N = 624;
    if (seeds.length < N) {
      return { seed: 0, valid: false };
    }
    
    return { seed: seeds[0], valid: true };
  }
  
  static untemper(output: number): number {
    let y = output;
    
    y ^= y >>> 18;
    y ^= (y << 15) & 0xefc60000;
    
    let y2 = y ^ ((y << 7) & 0x9d2c5680);
    y = y2 ^ (y2 >>> 7);
    for (let i = 0; i < 4; i++) {
      y2 = y ^ ((y << 7) & 0x9d2c5680);
      y = y2 ^ (y2 >>> 7);
    }
    
    y ^= y >>> 11;
    y ^= y >>> 18;
    
    return y;
  }
  
  static cloneMT19937(state: number[]): number[] {
    return [...state];
  }
}

export class HashExtension {
  static md5LengthExtension(
    knownHash: string,
    knownLength: number,
    appendData: string,
    blockSize: number = 64
  ): { hash: string; message: string } | null {
    return null;
  }
  
  static sha1LengthExtension(
    knownHash: string,
    knownLength: number,
    appendData: string,
    blockSize: number = 64
  ): { hash: string; message: string } | null {
    return null;
  }
  
  static sha256LengthExtension(
    knownHash: string,
    knownLength: number,
    appendData: string,
    blockSize: number = 64
  ): { hash: string; message: string } | null {
    return null;
  }
}

export class AESGCM {
  static isGCMMode(ciphertext: Buffer): boolean {
    const header = ciphertext.slice(0, 4).toString('hex');
    return header.startsWith('01') || header.startsWith('02');
  }
  
  static detectNonce(ciphertext: Buffer): Buffer | null {
    if (ciphertext.length < 12) return null;
    return ciphertext.slice(0, 12);
  }
  
  static extractTag(ciphertext: Buffer): Buffer | null {
    if (ciphertext.length < 16) return null;
    return ciphertext.slice(-16);
  }
}

export class ElGamal {
  static encrypt(message: bigint, p: bigint, g: bigint, y: bigint): { c1: bigint; c2: bigint } {
    const pMinus2 = p - 2n;
    const k = BigInt(Math.floor(Math.random() * Number(pMinus2))) + 1n;
    const c1 = modPow(g, k, p);
    const c2 = (message * modPow(y, k, p)) % p;
    return { c1, c2 };
  }
  
  static decrypt(c1: bigint, c2: bigint, p: bigint, x: bigint): bigint {
    const s = modPow(c1, x, p);
    const sInv = modInverse(s, p);
    return (c2 * sInv) % p;
  }
  
  static attackKnownMessage(
    c1: bigint,
    c2: bigint,
    p: bigint,
    g: bigint,
    messages: bigint[]
  ): bigint | null {
    for (const m of messages) {
      const y = (c2 * modInverse(m, p)) % p;
      if (modPow(c1, (p - 1n) / 2n, p) === y % p) {
        return m;
      }
    }
    return null;
  }
}

export default {
  ECC,
  DSA,
  PRNG,
  HashExtension,
  AESGCM,
  ElGamal
};
