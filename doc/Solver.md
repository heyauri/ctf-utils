# Solver Module Documentation

## Overview

The Solver module provides advanced tools for solving CTF challenges, including cryptographic attacks, forensics analysis, binary exploitation, and mathematical utilities.

## Table of Contents
- [Crypto Module](#crypto-module)
  - [RSA Submodule](#rsa-submodule)
  - [Hash Submodule](#hash-submodule)
  - [Lattice Submodule](#lattice-submodule)
- [Forensics Module](#forensics-module)
- [Exploitation Module](#exploitation-module)
- [Math Module](#math-module)
- [Web Module](#web-module)
- [Reverse Engineering Module](#reverse-engineering-module)
- [Analysis Module](#analysis-module)
- [Utils Module](#utils-module)

## Crypto Module

The Crypto module provides comprehensive cryptographic challenge tools, including RSA cryptography, hash attacks, and lattice-based cryptography attacks.

### RSA Submodule

The RSA submodule provides tools for RSA cryptography challenges, including key generation, encryption/decryption, and common attacks.

#### RSA Features

- **Key Generation** - Generate RSA key pairs with configurable bit length
- **Encryption/Decryption** - Basic RSA encryption and decryption with CRT optimization
- **Common Attacks** - Implementation of various RSA attack methods
- **Utility Functions** - Prime detection, key strength evaluation, GCD, modular inverse, etc.

#### RSA Usage Example

```javascript
const { solver } = require("ctf-utils");

// Generate RSA key pair
const keyPair = await solver.Crypto.RSA.generateKeyPair(512);
console.log(keyPair.publicKey);
console.log(keyPair.privateKey);

// Encrypt and decrypt message
const message = "Hello, RSA!";
const encrypted = solver.Crypto.RSA.encrypt(message, keyPair.publicKey);
const decrypted = solver.Crypto.RSA.decrypt(encrypted, keyPair.privateKey);
console.log(decrypted); // "Hello, RSA!"

// Evaluate key strength
const strength = solver.Crypto.RSA.evaluateKeyStrength(keyPair.publicKey.n);
console.log(strength); // { keySize: 512, strength: "Weak" }

// Run small exponent attack (e=3)
const n = 3233n; // 61 * 53
const e = 3n;
const ciphertext = 2790n;
const plaintext = solver.Crypto.RSA.attacks.smallExponent(ciphertext, { n, e });
console.log(plaintext); // 42n

// Run Coppersmith small root attack
const polynomial = (x) => x - 42n;
const root = solver.Crypto.RSA.attacks.coppersmith(n, polynomial, 0.5);
console.log(root); // 42n
```

#### Supported RSA Attacks

| Attack | Description |
|--------|-------------|
| smallExponent | Small exponent attack (e=3) |
| commonModulus | Common modulus attack with two different exponents |
| wiener | Wiener small private key attack |
| hastadBroadcast | Hastad broadcast attack using multiple public keys |
| franklinReiter | Franklin-Reiter related message attack |
| franklinReiterImproved | Improved Franklin-Reiter attack |
| bonehDurfee | Boneh-Durfee small private key attack |
| coppersmith | Coppersmith polynomial small root attack |
| coppersmithFactor | Coppersmith partial information factorization attack |
| rsaCrtFaultAttack | CRT fault implementation attack |
| rsaKeygenWeakness | Key generation weakness exploitation |
| lowExponentCRT | Low exponent CRT attack |
| primePowerModulus | Prime power modulus attack |
| multiPrimeRSA | Multi-prime RSA factorization |
| factorKnownPrimes | Factor n using known p and q |
| privateKeyFromFactors | Calculate private key from prime factors |
| trialDivision | Small factor trial division |
| factorWithKnownPhi | Factorization with known φ(n) |
| rsaCrtImplementationError | CRT implementation error attack |
| lowExponentRelatedMessages | Low exponent related messages attack |
| commonPrimeAttack | Common prime attack |
| rsaPrivateKeyFaultInjection | Private key fault injection attack |

### Hash Submodule

The Hash submodule provides tools for hash analysis and attacks, including hash generation, cracking, and collision detection.

#### Hash Features

- **Hash Generation** - Generate hashes using MD5, SHA1, SHA256, SHA512 algorithms
- **Brute Force** - Hash brute force using configurable character set
- **Dictionary Attack** - Dictionary-based hash cracking
- **Rainbow Table Attack** - Rainbow table-based hash cracking
- **Hash Collision** - Find hash collisions (using cryptographically secure random numbers)
- **Hash Prefix Generation** - Generate hashes with specified prefix
- **Hash Length Extension** - Perform hash length extension attack
- **Hash Type Analysis** - Analyze hash type based on length and pattern

#### Hash Usage Example

```javascript
const { solver } = require("ctf-utils");

// Generate hash
const md5Hash = solver.Crypto.Hash.md5("test");
const sha1Hash = solver.Crypto.Hash.sha1("test");
console.log(md5Hash, sha1Hash);

// Brute force hash
const plaintext = "abc";
const hash = solver.Crypto.Hash.md5(plaintext);
const result = solver.Crypto.Hash.bruteForceHash(hash, "abcdefghijklmnopqrstuvwxyz", 3);
console.log(result); // "abc"

// Analyze hash type
const hashToAnalyze = "5d41402abc4b2a76b9719d911017c592";
const algorithms = solver.Crypto.Hash.analyzeHashType(hashToAnalyze);
console.log(algorithms); // ["MD5"]

// Generate hash with prefix
const prefix = "00";
const input = solver.Crypto.Hash.generateHashWithPrefix(prefix, 2);
const generatedHash = solver.Crypto.Hash.md5(input);
console.log(input, generatedHash);

// Find hash collision
const collision = solver.Crypto.Hash.findHashCollision("md5", 1000000);
if (collision) {
  console.log(collision.input1, collision.input2, collision.hash);
}
```

### Lattice Submodule

The Lattice submodule provides tools for lattice-based cryptographic attacks, including LLL algorithm and lattice-based RSA attacks.

#### Lattice Features

- **LLL Algorithm** - Lattice basis reduction algorithm
- **Hastad Broadcast Attack** - Broadcast attack using lattice methods
- **Vector Dot Product** - Calculate vector dot product
- **Vector Norm** - Calculate vector norm
- **Vector Operations** - Vector addition, subtraction, scalar multiplication
- **Gram-Schmidt Orthogonalization** - Gram-Schmidt orthogonalization of lattice basis
- **Short Vector Search** - Find short vectors in lattice
- **Integer Root Calculation** - Calculate n-th root of large integers

#### Lattice Usage Example

```javascript
const { solver } = require("ctf-utils");

// Use LLL algorithm to reduce lattice basis
const basis = [
  { elements: [1, 0, 0] },
  { elements: [1, 2, 0] },
  { elements: [1, 1, 1] }
];
const result = solver.Crypto.Lattice.LatticeAttacks.lllAlgorithm(basis);
console.log(result.reducedBasis, result.determinant);

// Use Hastad broadcast attack
const moduli = [n1, n2, n3]; // Multiple RSA moduli
const ciphertexts = [c1, c2, c3]; // Corresponding ciphertexts
const e = 3n; // Common exponent
const plaintext = solver.Crypto.Lattice.LatticeAttacks.hastadBroadcastAttack(moduli, ciphertexts, e);
console.log(plaintext);
```

## Web Module

The Web module provides tools for analyzing HTTP requests/responses and detecting web security vulnerabilities.

### HTTP Submodule

The HTTP submodule provides tools for parsing and analyzing HTTP requests and responses.

#### HTTP Features

- **Request Parsing** - Parse HTTP requests into structured objects
- **Response Parsing** - Parse HTTP responses into structured objects
- **Security Analysis** - Analyze security issues in HTTP messages
- **Request/Response Generation** - Generate HTTP messages from structured data

#### HTTP Usage Example

```javascript
const { solver } = require("ctf-utils");

// Parse HTTP request
const requestString = 'GET /api/users HTTP/1.1\r\nHost: example.com\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\n\r\n';
const request = solver.Web.HTTP.HTTPAnalyzer.parseRequest(requestString);
console.log(request.method, request.path, request.headers);

// Parse HTTP response
const responseString = 'HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: 13\r\n\r\n{"status":"ok"}';
const response = solver.Web.HTTP.HTTPAnalyzer.parseResponse(responseString);
console.log(response.statusCode, response.statusMessage, response.body);

// Analyze request security
const securityIssues = solver.Web.HTTP.HTTPAnalyzer.analyzeRequestSecurity(request);
console.log(securityIssues);
```

### Security Submodule

The Security submodule provides tools for analyzing web security issues, including JWT tokens, CSRF tokens, and XSS vulnerabilities.

#### Security Features

- **JWT Analysis** - Parse and verify JWT tokens
- **CSRF Token Analysis** - Analyze CSRF token security
- **XSS Payload Generation** - Generate XSS test payloads
- **XSS Detection** - Detect XSS vulnerabilities in HTML
- **Session Management Analysis** - Analyze session cookie security
- **SQL Injection Detection** - Detect SQL injection patterns

#### Security Usage Example

```javascript
const { solver } = require("ctf-utils");

// Parse JWT token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJleHAiOjk5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const jwt = solver.Web.Security.WebSecurity.parseJWT(token);
console.log(jwt.header, jwt.payload);

// Verify JWT token
const secret = 'secret';
const isValid = solver.Web.Security.WebSecurity.verifyJWT(token, secret);
console.log(isValid);

// Generate XSS payloads
const xssType = 'stored';
const payloads = solver.Web.Security.WebSecurity.generateXSSPayloads(xssType);
console.log(payloads);
```

## Reverse Engineering Module

The Reverse Engineering module provides tools for analyzing binary files and control flow graphs.

### Reverse Engineering Features

- **Control Flow Analysis** - Analyze control flow graphs of binary files
- **Binary Disassembly** - Disassemble binary code into assembly instructions
- **Function Identification** - Identify functions in binary files
- **Call Graph Generation** - Generate call graphs for binary files
- **String Analysis** - Extract and analyze strings from binary files
- **Symbol Analysis** - Analyze import/export symbols in binary files
- **Binary Structure Analysis** - Analyze binary file structure (ELF, PE)
- **Security Analysis** - Analyze security features of binary files (canary, PIE, NX)
- **Vulnerability Analysis** - Detect potential vulnerabilities in binary files

### Reverse Engineering Usage Example

```javascript
const { solver } = require("ctf-utils");

// Analyze control flow graph
const cflow = solver.ReverseEngineering.BinaryAnalysis.analyzeControlFlow('program');
console.log(cflow.functions);

// Disassemble binary code
const instructions = solver.ReverseEngineering.BinaryAnalysis.disassembleBinary('program', '0x08048000', '0x08048100');
console.log(instructions);

// Analyze binary structure
const structure = solver.ReverseEngineering.BinaryAnalysis.analyzeBinaryStructure('program');
console.log(structure.format, structure.architecture, structure.sections);
```

## Analysis Module

The Analysis module provides tools for cryptanalysis and frequency analysis.

### Analysis Features

- **Frequency Analysis** - Analyze character frequency in ciphertext
- **Cryptanalysis Tools** - Tools for breaking classical ciphers

### Analysis Usage Example

```javascript
const { solver } = require("ctf-utils");

// Frequency analysis
const ciphertext = 'GUR DHVPX OEBJA QBT WHZCRQ BIRE GUR YNML SBK.';
const analysis = solver.Analysis.FrequencyAnalysis.analyze(ciphertext);
console.log(analysis);

// English letter frequency comparison
const englishFreq = solver.Analysis.FrequencyAnalysis.englishFrequencies;
console.log(englishFreq);
```

## Utils Module

The Utils module provides utility functions for CTF challenges, including dictionary generation.

### Utils Features

- **Dictionary Generation** - Generate dictionaries for brute force
- **General Utilities** - Various utility functions for CTF challenges

### Utils Usage Example

```javascript
const { solver } = require("ctf-utils");

// Generate dictionary
const charset = 'abcdefghijklmnopqrstuvwxyz';
const minLength = 1;
const maxLength = 3;
const dictionary = solver.Utils.DictionaryGenerator.generate(charset, minLength, maxLength);
console.log(dictionary);
```

## Forensics Module

The Forensics module provides tools for analyzing files, extracting hidden data, and detecting steganography.

### Forensics Features

- **File Type Detection** - Identify file types based on magic bytes
- **PNG Analysis** - Analyze PNG structure and detect steganography
- **ZIP Analysis** - Detect pseudo-encryption in ZIP files
- **LSB Extraction** - Extract hidden data from images using LSB steganography
- **Memory Forensics** - Analyze memory dumps and extract information
- **Network Traffic Analysis** - Analyze PCAP files and network traffic patterns
- **Audio Steganography** - Audio file steganography analysis

### Forensics Usage Example

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

The Exploitation module provides tools for binary exploitation, including ROP chain generation, buffer overflow tools, and shellcode generation.

### Exploitation Features

- **ROP Chain Generation** - Generate Return-Oriented Programming chains
- **Buffer Overflow Tools** - Calculate offsets and generate payloads
- **Shellcode Generation** - Generate shellcode for various architectures
- **Format String Exploitation** - Analyze and exploit format string vulnerabilities
- **Heap Exploitation** - Tools for heap overflow and use-after-free vulnerabilities
- **Binary Structure Analysis** - Analyze ELF, PE, and Mach-O binary files

### Exploitation Usage Example

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
// After crashing program with pattern
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

The Math module provides advanced mathematical tools for solving CTF challenges, including number theory, linear algebra, combinatorics, and cryptographic mathematics.

### Math Features

- **Number Theory** - GCD, LCM, Extended Euclidean Algorithm, Modular Inverse, Euler's Totient, Möbius Function, Primitive Root
- **Linear Algebra** - Matrix operations, determinant, inverse matrix
- **Combinatorics** - Permutations, combinations, subsets, binomial coefficients
- **Cryptographic Mathematics** - Prime testing (Miller-Rabin), modular exponentiation, discrete logarithm
- **Factorization** - Pollard's Rho algorithm, trial division
- **Chinese Remainder Theorem** - Solve linear congruence systems using CRT
- **Quadratic Residues** - Solve quadratic congruence equations (Tonelli-Shanks algorithm)

### Math Usage Example

```javascript
const { solver } = require("ctf-utils");

// Number theory
const gcd = solver.Math.gcd(12345n, 67890n);
const lcm = solver.Math.lcm(12345n, 67890n);
const modInverse = solver.Math.modInverse(3n, 26n);
const extendedGcd = solver.Math.extendedGcd(35n, 15n);
const phi = solver.Math.eulerTotient(12n);
const isPrime = solver.Math.isPrime(999999937n);

// Linear algebra
const matrix = [[1, 2], [3, 4]];
const determinant = solver.Math.matrixDeterminant(matrix);
const inverse = solver.Math.matrixInverse(matrix);
const product = solver.Math.matrixMultiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]);

// Combinatorics
const combinations = solver.Math.generateCombinations([1, 2, 3, 4], 2);
const permutations = solver.Math.generatePermutations([1, 2, 3]);
const subsets = solver.Math.generateSubsets([1, 2, 3]);
const binom = solver.Math.binomialCoefficient(10, 3);

// Cryptographic mathematics
const modularExp = solver.Math.modPow(2n, 10n, 1000n);
const discreteLog = solver.Math.discreteLogarithm(2n, 8n, 11n);
const primitiveRoot = solver.Math.findPrimitiveRoot(11n);

// Factorization
const factors = solver.Math.pollardsRho(123456789n);
console.log(factors);

// Chinese Remainder Theorem
const congruences = [[2n, 3n], [3n, 5n], [2n, 7n]];
const result = solver.Math.solveCRT(congruences);
console.log(result); // 23n

// Quadratic congruence solving
const solutions = solver.Math.solveQuadraticCongruence(3n, 11n);
console.log(solutions);
```
