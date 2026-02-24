# Solver Modules Documentation

## Overview

The solver modules provide advanced, optimized tools for solving CTF challenges, including cryptographic attacks, forensics analysis, binary exploitation, and mathematical utilities. All modules have been optimized for performance, especially for large integer operations and cryptographic attacks.

## Key Optimizations

- **Parallel processing** - Some operations use parallel execution for faster results
- **Memory efficiency** - Optimized memory usage for handling large integers and complex operations
- **Algorithm improvements** - Enhanced implementations of cryptographic algorithms and attacks
- **Error handling** - Robust error handling for edge cases and large inputs
- **Performance metrics** - Some operations include execution time measurements for debugging

## Table of Contents
- [Crypto Module](#crypto-module)
- [Forensics Module](#forensics-module)
- [Exploitation Module](#exploitation-module)
- [Math Module](#math-module)
- [Web Module](#web-module)
- [ReverseEngineering Module](#reverseengineering-module)
- [Analysis Module](#analysis-module)
- [Utils Module](#utils-module)

## Crypto Module

The Crypto module provides comprehensive tools for cryptographic challenges, including RSA cryptography and hash attacks.

### RSA Submodule

The RSA submodule provides tools for RSA cryptography challenges, including key generation, encryption/decryption, and common attacks.

#### RSA Features

- **Key generation** - Generate RSA key pairs with configurable bit lengths
- **Encryption/decryption** - Basic RSA encryption and decryption with CRT optimization
- **Common attacks** - Implementations of various RSA attack methods
- **Utility functions** - Prime detection, key strength evaluation, and more

#### RSA Usage Examples

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

// Run Coppersmith attack for small roots
const polynomial = (x) => x - 42n;
const root = solver.Crypto.RSA.attacks.coppersmith(n, polynomial, 0.5);
console.log(root); // 42n
```

#### Supported RSA Attacks

| Attack | Description |
|--------|-------------|
| smallExponent | Small exponent attack (e=3) |
| commonModulus | Common modulus attack with two different exponents |
| wiener | Wiener's attack for small private exponent |
| hastadBroadcast | Hastad's broadcast attack with multiple public keys |
| franklinReiter | Franklin-Reiter related message attack |
| franklinReiterImproved | Improved Franklin-Reiter attack for any e |
| bonehDurfee | Boneh-Durfee attack for small private exponent |
| coppersmith | Coppersmith's attack for small roots of polynomials |
| coppersmithFactor | Coppersmith's attack for factoring with partial information |
| rsaCrtFaultAttack | RSA-CRT fault injection attack |
| rsaKeygenWeakness | RSA key generation weakness attack |
| lowExponentCRT | Low exponent attack with CRT implementation |
| primePowerModulus | RSA with prime power modulus attack |
| multiPrimeRSA | Multi-prime RSA attack |
| factorWithKnownPhi | Factor n with known Euler's totient function |
| rsaCrtImplementationError | RSA CRT implementation error attack |
| lowExponentRelatedMessages | Low exponent attack with related messages |
| commonPrimeAttack | Common prime attack between two RSA keys |
| rsaPrivateKeyFaultInjection | RSA private key fault injection attack |
| factorKnownPrimes | Factor n using known p and q |
| privateKeyFromFactors | Calculate private key from prime factors |
| trialDivision | Trial division for small factors |

### Hash Submodule

The Hash submodule provides tools for hash analysis and attacks, including hash generation, cracking, and collision detection.

#### Hash Features

- **Hash generation** - Generate hashes using MD5, SHA1, SHA256, SHA512 algorithms
- **Brute force attack** - Brute force hash cracking with configurable character sets
- **Dictionary attack** - Dictionary-based hash cracking
- **Rainbow table attack** - Rainbow table-based hash cracking
- **Hash collision** - Find hash collisions
- **Hash prefix generation** - Generate hashes with specified prefixes
- **Hash length extension** - Perform hash length extension attacks
- **Hash type analysis** - Analyze hash types based on length and pattern

#### Hash Usage Examples

```javascript
const { solver } = require("ctf-utils");

// Generate hash
const md5Hash = solver.Crypto.Hash.md5("test");
const sha1Hash = solver.Crypto.Hash.sha1("test");
console.log(md5Hash, sha1Hash);

// Brute force hash cracking
const plaintext = "abc";
const hash = solver.Crypto.Hash.md5(plaintext);
const result = solver.Crypto.Hash.bruteForceHash(hash, "abcdefghijklmnopqrstuvwxyz", 3);
console.log(result); // "abc"

// Analyze hash type
const hashToAnalyze = "5d41402abc4b2a76b9719d911017c592";
const algorithms = solver.Crypto.Hash.analyzeHashType(hashToAnalyze);
console.log(algorithms); // ["MD5"]

// Generate hash with specified prefix
const prefix = "00";
const input = solver.Crypto.Hash.generateHashWithPrefix(prefix, 2);
const generatedHash = solver.Crypto.Hash.md5(input);
console.log(input, generatedHash);
```

## Web Module

The Web module provides tools for analyzing HTTP requests/responses and detecting web security vulnerabilities.

### HTTP Submodule

The HTTP submodule provides tools for parsing and analyzing HTTP requests and responses.

#### HTTP Features

- **Request parsing** - Parse HTTP requests into structured objects
- **Response parsing** - Parse HTTP responses into structured objects
- **Security analysis** - Analyze HTTP messages for security issues
- **Request/response generation** - Generate HTTP messages from structured data

#### HTTP Usage Examples

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

- **JWT analysis** - Parse and verify JWT tokens
- **CSRF token analysis** - Analyze CSRF token security
- **XSS payload generation** - Generate XSS test payloads
- **XSS detection** - Detect XSS vulnerabilities in HTML
- **Session management analysis** - Analyze session cookie security
- **SQL injection detection** - Detect SQL injection patterns

#### Security Usage Examples

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

## ReverseEngineering Module

The ReverseEngineering module provides tools for analyzing binary files and control flow graphs.

### ReverseEngineering Features

- **Control flow analysis** - Analyze control flow graphs of binary files
- **Binary disassembly** - Disassemble binary code into assembly instructions
- **Function identification** - Identify functions in binary files
- **Call graph generation** - Generate call graphs for binary files
- **String analysis** - Extract and analyze strings from binary files
- **Symbol analysis** - Analyze import/export symbols in binary files
- **Binary structure analysis** - Analyze binary file structure (ELF, PE)
- **Security analysis** - Analyze binary files for security features (canary, PIE, NX)
- **Vulnerability analysis** - Detect potential vulnerabilities in binary files

### ReverseEngineering Usage Examples

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

- **Frequency analysis** - Analyze character frequencies in ciphertext
- **Cryptanalysis utilities** - Tools for breaking classical ciphers

### Analysis Usage Examples

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

- **Dictionary generation** - Generate dictionaries for brute force attacks
- **General utilities** - Various utility functions for CTF challenges

### Utils Usage Examples

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