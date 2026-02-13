# Solver Modules Documentation

## Overview

The solver modules provide advanced tools for solving CTF challenges, including cryptographic attacks, forensics analysis, binary exploitation, and mathematical utilities.

## Table of Contents
- [RSA Module](#rsa-module)
- [Forensics Module](#forensics-module)
- [Exploitation Module](#exploitation-module)
- [Math Module](#math-module)

## RSA Module

The RSA module provides comprehensive tools for RSA cryptography challenges, including key generation, encryption/decryption, and common attacks.

### RSA Features

- **Key generation** - Generate RSA key pairs with configurable bit lengths
- **Encryption/decryption** - Basic RSA encryption and decryption with CRT optimization
- **Common attacks** - Implementations of various RSA attack methods
- **Utility functions** - Prime detection, key strength evaluation, and more

### RSA Usage Examples

```javascript
const { solver } = require("ctf-utils");

// Generate RSA key pair
const keyPair = await solver.RSA.generateKeyPair(512);
console.log(keyPair.publicKey);
console.log(keyPair.privateKey);

// Encrypt and decrypt message
const message = "Hello, RSA!";
const encrypted = solver.RSA.encrypt(message, keyPair.publicKey);
const decrypted = solver.RSA.decrypt(encrypted, keyPair.privateKey);
console.log(decrypted); // "Hello, RSA!"

// Evaluate key strength
const strength = solver.RSA.evaluateKeyStrength(keyPair.publicKey.n);
console.log(strength); // { keySize: 512, strength: "Weak" }

// Run small exponent attack (e=3)
const n = 3233n; // 61 * 53
const e = 3n;
const ciphertext = 2790n;
const plaintext = solver.RSA.attacks.smallExponent(ciphertext, { n, e });
console.log(plaintext); // 42n

// Run Coppersmith attack for small roots
const polynomial = (x) => x - 42n;
const root = solver.RSA.attacks.coppersmith(n, polynomial, 0.5);
console.log(root); // 42n
```

### Supported RSA Attacks

| Attack | Description |
|--------|-------------|
| smallExponent | Small exponent attack (e=3) |
| commonModulus | Common modulus attack with two different exponents |
| wiener | Wiener's attack for small private exponent |
| hastadBroadcast | Hastad's broadcast attack with multiple public keys |
| franklinReiter | Franklin-Reiter related message attack |
| bonehDurfee | Boneh-Durfee attack for small private exponent |
| coppersmith | Coppersmith's attack for small roots of polynomials |
| coppersmithFactor | Coppersmith's attack for factoring with partial information |
| factorKnownPrimes | Factor n using known p and q |
| privateKeyFromFactors | Calculate private key from prime factors |
| trialDivision | Trial division for small factors |

## Forensics Module

The Forensics module provides tools for analyzing files, extracting hidden data, and detecting steganography.

### Forensics Features

- **File type detection** - Identify file types based on magic bytes
- **PNG analysis** - Analyze PNG structure and detect steganography
- **ZIP analysis** - Detect pseudo-encryption in ZIP files
- **LSB extraction** - Extract hidden data from images using least significant bit steganography
- **Memory forensics** - Analyze memory dumps and extract information
- **Network traffic analysis** - Analyze PCAP files and network traffic patterns

### Forensics Usage Examples

```javascript
const { solver } = require("ctf-utils");
const fs = require("fs");

// File type detection
const pngBuffer = fs.readFileSync("image.png");
const types = solver.Forensics.BinaryFile.detect(pngBuffer);
console.log(types); // ['png']

// PNG structure analysis
const pngInfo = solver.Forensics.PNGCheck.check("image.png");
console.log(pngInfo);

// ZIP pseudo-encryption detection
const zipInfo = solver.Forensics.ZIPInfo.analyze("file.zip");
console.log(zipInfo.hasPseudoEncryption);

// LSB steganography extraction
const hiddenData = solver.Forensics.LSBExtract.extract("stego.png", 1, "LSB");
console.log(hiddenData);

// Memory forensics
const memoryDump = fs.readFileSync("memory.dmp");
const memoryInfo = solver.Forensics.MemoryForensics.analyze(memoryDump);
console.log(memoryInfo);

// Network traffic analysis
const pcapData = fs.readFileSync("traffic.pcap");
const networkInfo = solver.Forensics.NetworkTraffic.analyze(pcapData);
console.log(networkInfo);
```

## Exploitation Module

The Exploitation module provides tools for binary vulnerability exploitation, including ROP chain generation, buffer overflow utilities, and shellcode generation.

### Exploitation Features

- **ROP chain generation** - Generate return-oriented programming chains
- **Buffer overflow utilities** - Calculate offsets and generate payloads
- **Shellcode generation** - Generate shellcode for various architectures
- **Format string exploitation** - Analyze and exploit format string vulnerabilities
- **Heap exploitation** - Tools for heap overflow and use-after-free vulnerabilities
- **Binary structure analysis** - Analyze ELF, PE, and Mach-O binaries

### Exploitation Usage Examples

```javascript
const { solver } = require("ctf-utils");

// ROP chain generation
const ropChain = solver.Exploitation.ROP.generateChain([
  { address: 0xdeadbeef, args: [0x1234, 0x5678] },
  { address: 0xcafebabe, args: [0x9abc] }
]);
console.log(ropChain);

// Buffer overflow offset calculation
const pattern = solver.Exploitation.BufferOverflow.generatePattern(200);
// After crashing the program with the pattern
const offset = solver.Exploitation.BufferOverflow.findOffset("0x41424344");
console.log("Buffer overflow offset:", offset);

// Shellcode generation
const shellcode = solver.Exploitation.Shellcode.generate("x86", "linux", "execve");
console.log(shellcode);

// Format string vulnerability analysis
const formatStringInfo = solver.Exploitation.FormatString.analyze("%x.%x.%x");
console.log(formatStringInfo);

// Binary structure analysis
const binaryInfo = solver.Exploitation.BinaryFile.analyze("program");
console.log(binaryInfo);
```

## Math Module

The Math module provides advanced mathematical utilities for solving CTF challenges, including number theory, linear algebra, combinatorics, and cryptographic math.

### Math Features

- **Number theory** - GCD, LCM, extended Euclidean algorithm, modular inverse, etc.
- **Linear algebra** - Matrix operations, determinants, inverses
- **Combinatorics** - Permutations, combinations, subsets
- **Cryptographic math** - Primality testing, modular exponentiation, discrete logarithms
- **Factorization** - Pollard's Rho algorithm, trial division

### Math Usage Examples

```javascript
const { solver } = require("ctf-utils");

// Number theory
const gcd = solver.Math.gcd(12345n, 67890n);
const lcm = solver.Math.lcm(12345n, 67890n);
const modInverse = solver.Math.modInverse(3n, 26n);

// Linear algebra
const matrix = [[1, 2], [3, 4]];
const determinant = solver.Math.matrixDeterminant(matrix);
const inverse = solver.Math.matrixInverse(matrix);

// Combinatorics
const combinations = solver.Math.generateCombinations([1, 2, 3, 4], 2);
const permutations = solver.Math.generatePermutations([1, 2, 3]);

// Cryptographic math
const isPrime = solver.Math.isPrime(999999937n);
const modularExp = solver.Math.modularExponentiation(2n, 10n, 1000n);

// Factorization
const factors = solver.Math.pollardsRho(123456789n);
console.log(factors);
```