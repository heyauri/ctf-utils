# CTF-UTILS

A Node.js based CTF toolkit for detecting, decoding, and encoding messages using various cryptographic and encoding methods.

## Features

- **60+ encoding/crypto methods** - Comprehensive support for classical ciphers, modern encodings, and steganography tools
- **TypeScript support** - Full type definitions included
- **Dual async/sync API** - Choose between async (Promise) or sync methods
- **CTFUtils class** - Chainable API for encoding/decoding operations
- **Optimized CLI tool** - Command-line interface with parallel processing and improved user experience
- **File analysis tools** - LSB steganography, PNG structure analysis, ZIP pseudo-encryption detection
- **Advanced RSA solver** - Optimized RSA cryptography tools with support for key generation, encryption/decryption, and 20+ attack methods
- **Forensics tools** - File analysis and steganography detection utilities
- **Exploitation tools** - Binary vulnerability exploitation utilities
- **Optimized Math utilities** - Advanced mathematical functions with improved performance for cryptography
- **Well-structured documentation** - Clear separation of documentation responsibilities

## Documentation Structure

The project documentation is organized into the following files:

- **README.md** - General project overview, installation, and quick start guide
- **doc/README-zh.md** - Chinese version of the README
- **doc/CryptoTypes.md** - Detailed documentation for cryptographic types and encoding methods
- **doc/CryptoTypes-zh.md** - Chinese version of CryptoTypes documentation
- **doc/Solver.md** - Documentation for solver modules (RSA, Forensics, Exploitation, Math)
- **doc/Solver-zh.md** - Chinese version of Solver documentation

## Installation

### As a package

```bash
npm install ctf-utils
# or
pnpm add ctf-utils
```

```javascript
const ctfUtils = require("ctf-utils");
```

### As a CLI

```bash
npm install -g ctf-utils
ctf-utils detect '636A56355279427363446C4A49454A71545342'
```

## Quick Start

### Direct API

```javascript
const { detect, decode, encode, CTFUtils } = require("ctf-utils");

// Detect encoding type
detect.Brainfuck("++[>+<-]");     // true

// Decode (async)
await decode.Base85("NM&qn0001Q"); // "Hello"

// Encode (async)
await encode.Base64("hello");      // "aGVsbG8="

// Sync versions available
decodeSync.Base64("aGVsbG8=");    // "hello"
encodeSync.Base64("hello");       // "aGVsbG8="
```

### CTFUtils Class (Chainable API)

```javascript
const { CTFUtils } = require("ctf-utils");

// Async mode
const result1 = await new CTFUtils("Hello", "KEY")
    .encode.Base64()
    .val();
console.log(result1); // "SGVsbG8="

// Sync mode
const result2 = new CTFUtils("Hello", "KEY")
    .encodeSync.Base64()
    .val();
console.log(result2); // "SGVsbG8="

// With key
await new CTFUtils("HELLO")
    .encode.ADFGVX("KEY")
    .val(); // "DDGAXDFAGF"
```

## CLI Usage

```bash
# Detect encoding type
ctf-utils detect <Input>

# Encode
ctf-utils encode <method> <Input> [-k, --key <key>]

# Decode
ctf-utils decode <method> <Input> [-k, --key <key>]
```

### CLI Examples

```bash
# Detect Brainfuck
ctf-utils detect "++[>+<-]>"
# Output: Brainfuck       Poem

# Base85 encode
ctf-utils encode Base85 "Hello"
# Output: [Base85] Hello => NM&qn0001Q

# ADFGVX encode with key
ctf-utils encode ADFGVX "HELLO" -k "KEY"
# Output: [ADFGVX] HELLO => DDGAXDFAGF

# ADFGVX decode with key
ctf-utils decode ADFGVX "DDGAXDFAGF" -k "KEY"
# Output: [ADFGVX] DDGAXDFAGF => HVALW
```

## Supported Methods

### Classical Ciphers

| Cipher | Detect | Decode | Encode | Description |
|--------|--------|--------|--------|-------------|
| Caesar | | ✅ | ✅ | Shift cipher with configurable shift |
| ROT5/13/47 | | ✅ | ✅ | ROTation ciphers |
| Vigenere | ✅ | ✅ | ✅ | Polyalphabetic substitution cipher |
| Playfair | ✅ | ✅ | ✅ | Polygraphic substitution cipher |
| Affine | ✅ | ✅ | ✅ | Linear substitution cipher |
| RailFence | ✅ | ✅ | ✅ | Transposition cipher |
| Atbash | ✅ | ✅ | ✅ | Alphabet reversal cipher |
| SimpleSub | ✅ | ✅ | ✅ | Simple substitution cipher |
| ADFGVX | ✅ | ✅ | ✅ | Fractionated cipher |
| Polybius | ✅ | ✅ | ✅ | Square coordinate cipher |

### Modern Encodings

| Encoding | Detect | Decode | Encode | Description |
|----------|--------|--------|--------|-------------|
| Base64 | ✅ | ✅ | ✅ | RFC 4648 Base64 |
| Base32 | ✅ | ✅ | ✅ | RFC 4648 Base32 |
| Base16 | ✅ | ✅ | ✅ | Hexadecimal |
| Base58 | ✅ | ✅ | ✅ | Bitcoin address encoding |
| Base62 | ✅ | ✅ | ✅ | Compact encoding |
| Base85 | ✅ | ✅ | ✅ | Ascii85/high-density |
| Base91 | ✅ | ✅ | ✅ | High-efficiency encoding |
| HEX | ✅ | ✅ | ✅ | Hexadecimal string |
| OCT | ✅ | ✅ | ✅ | Octal string |
| Decimal | ✅ | ✅ | ✅ | Decimal ASCII |
| BinStr | ✅ | ✅ | ✅ | Binary string |
| URL | ✅ | ✅ | ✅ | URL encoding |
| HTML | ✅ | ✅ | ✅ | HTML entities |
| Unicode | ✅ | ✅ | ✅ | Unicode escape sequences |
| JQ | ✅ | ✅ | ✅ | Jothello's Quotes encoding |
| Pinyin | ✅ | ✅ | ✅ | Chinese pinyin encoding |
| Wubi | ✅ | ✅ | ✅ | Chinese wubi encoding |

### Brainfuck/Ook! Family

| Language | Detect | Decode | Encode | Description |
|----------|--------|--------|--------|-------------|
| Brainfuck | ✅ | ✅ | ✅ | Brainfuck language |
| Ook! | ✅ | ✅ | ✅ | Ook! language variant |

### Chinese Ciphers

| Cipher | Detect | Decode | Encode | Description |
|--------|--------|--------|--------|-------------|
| Morse | ✅ | ✅ | ✅ | Morse code |
| DangPu | ✅ | ✅ | ✅ | 当铺密码 (shop password) |
| ZaHuoPu | ✅ | ✅ | ✅ | 座右铭密码 (motto cipher) |
| Poem | ✅ | ✅ | ✅ | 藏头诗 (acrostic poem) |
| YuFoLunChan | ✅ | ✅ | ✅ | 与佛论禅 (Buddhist cipher) |
| Exponential | ✅ | ✅ | ✅ | Exponential cipher |

### Cryptographic Hash

| Hash | Detect | Encode | Description |
|------|--------|--------|-------------|
| MD5 | ✅ | ✅ | MD5 hash (32 hex) |
| SHA-1 | ✅ | ✅ | SHA-1 hash (40 hex) |
| SHA-256 | ✅ | ✅ | SHA-256 hash (64 hex) |
| SHA-384 | ✅ | ✅ | SHA-384 hash (96 hex) |
| RIPEMD-160 | ✅ | ✅ | RIPEMD-160 hash (40 hex) |

### Utility Functions

| Function | Detect | Description |
|----------|--------|-------------|
| XOR | ✅ | XOR encryption/brute-force |
| FrequencyAnalysis | | Character frequency analysis |
| DictionaryGenerator | | Password dictionary generation |
| AES/DES | | AES-128/192/256 and DES encryption |
| HashAttacks | | Hash cracking tools (brute force, dictionary, salted, HMAC) |
| BinaryAnalysis | | Binary file analysis and reverse engineering tools |

## Solver Modules

### RSA Solver

The RSA solver provides comprehensive tools for RSA cryptography challenges, including key generation, encryption/decryption, and common attacks.

#### RSA Features

- **Key generation** - Generate RSA key pairs with configurable bit lengths
- **Encryption/decryption** - Basic RSA encryption and decryption with CRT optimization
- **Common attacks** - Implementations of various RSA attack methods
- **Utility functions** - Prime detection, key strength evaluation, and more

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

### Forensics Tools

| Tool | Description |
|------|-------------|
| BinaryFile | File type detection via magic bytes |
| PNGCheck | PNG structure analysis & steganography detection |
| ZIPInfo | ZIP file analysis & pseudo-encryption detection |
| LSBExtract | Least Significant Bit steganography extraction |
| AudioSteganography | Audio file steganography analysis |

### Exploitation Tools

| Tool | Description |
|------|-------------|
| ROP | Return-oriented programming chain generation |
| BufferOverflow | Buffer overflow exploitation utilities |
| Shellcode | Shellcode generation for various architectures |
| FormatString | Format string vulnerability exploitation |
| HeapOverflow | Heap overflow exploitation utilities |

### Math Utilities

| Utility | Description |
|---------|-------------|
| Number Theory | GCD, LCM, extended Euclidean algorithm, modular inverse, etc. |
| Linear Algebra | Matrix operations, determinants, inverses |
| Combinatorics | Permutations, combinations, subsets |
| Cryptographic Math | Primality testing, modular exponentiation, discrete logarithms |
| Factorization | Pollard's Rho algorithm, trial division |

### Hash Attacks

The Hash Attacks module provides comprehensive tools for cracking cryptographic hashes, including various attack methods and techniques.

#### Hash Attacks Features

- **Hash type analysis** - Automatically detect hash algorithms based on hash length and pattern
- **Brute force attacks** - Iterative brute force with configurable character sets and length limits
- **Dictionary attacks** - Fast dictionary-based hash cracking
- **Salted hash attacks** - Cracking hashes with salt values
- **HMAC generation and cracking** - Generate and crack HMAC values
- **Support for multiple hash algorithms** - MD5, SHA-1, SHA-256, SHA-384, RIPEMD-160

### Binary Analysis

The Binary Analysis module provides tools for reverse engineering and analyzing binary files, helping with CTF challenges involving executable files and binary formats.

#### Binary Analysis Features

- **Binary type detection** - Identify file types (ELF, PE, Mach-O) and architectures (x86, x86-64, ARM, AArch64)
- **Header analysis** - Analyze binary file headers and sections
- **String extraction** - Extract printable strings from binary files with optimized performance
- **Symbol analysis** - Identify import/export symbols in binaries
- **Vulnerability detection** - Detect potential security vulnerabilities in binary files
- **Control flow analysis** - Generate control flow graphs for binary functions
- **Call graph generation** - Generate function call graphs for binary analysis
- **Disassembly** - Basic disassembly of binary code sections

### Web Security

The Web Security module provides comprehensive tools for analyzing and testing web application security, helping with CTF challenges involving web vulnerabilities.

#### Web Security Features

- **JWT analysis** - Parse, verify, and crack JWT tokens
- **SQL injection** - Detect and exploit SQL injection vulnerabilities with database fingerprinting
- **XSS testing** - Generate and test XSS payloads for stored, reflected, and DOM-based XSS
- **CSRF analysis** - Analyze CSRF token security
- **Session management** - Analyze session cookie security
- **Web security best practices** - Prevention tips and security recommendations

#### JWT Analysis Features

- **Token parsing** - Parse and validate JWT tokens
- **Signature verification** - Verify JWT signatures with provided keys
- **Vulnerability detection** - Detect common JWT vulnerabilities
- **Brute force cracking** - Brute force weak JWT secrets
- **Dictionary cracking** - Crack JWT secrets using wordlists
- **Signature bypass** - Generate signature bypass payloads
- **Token tampering** - Modify JWT tokens with known secrets

#### SQL Injection Features

- **Payload generation** - Generate SQL injection payloads for various DBMS
- **Database fingerprinting** - Identify database types and versions
- **Injection type detection** - Detect boolean-based, error-based, time-based, and union-based injection
- **Table/column extraction** - Generate payloads to extract table and column names
- **Security analysis** - Analyze SQL queries for injection vulnerabilities

### Lattice Cryptography

The Lattice Cryptography module provides tools for lattice-based cryptanalysis, helping with CTF challenges involving lattice-based cryptography.

#### Lattice Cryptography Features

- **LLL algorithm** - Implement the Lenstra-Lenstra-Lovász lattice basis reduction algorithm
- **Hastad broadcast attack** - Crack RSA with low exponent using multiple moduli
- **Low exponent attack** - Crack RSA with small public exponent
- **Franklin-Reiter attack** - Attack RSA with related messages
- **Short vector finding** - Find short vectors in lattices
- **Gram-Schmidt orthogonalization** - Perform Gram-Schmidt orthogonalization on vectors

## API Reference

### Direct Functions (Async by default)

```javascript
const { encode, decode, detect } = require("ctf-utils");

// Async (Promise-based)
await encode.Base64("hello");
await decode.Base64("aGVsbG8=");
await detect.Base64("aGVsbG8=");

// Sync versions
const { encodeSync, decodeSync, detectSync } = require("ctf-utils");
encodeSync.Base64("hello");
decodeSync.Base64("aGVsbG8=");
detectSync.Base64("aGVsbG8=");
```

### CTFUtils Class

```javascript
const { CTFUtils } = require("ctf-utils");

// Async methods
await new CTFUtils("hello")
    .encode.Base64()
    .decode.Base64()
    .val();

// Sync methods
new CTFUtils("hello")
    .encodeSync.Base64()
    .decodeSync.Base64()
    .val();

// Methods with keys
await new CTFUtils("HELLO", "KEY")
    .encode.ADFGVX()
    .val();
```

### Solver Modules Usage

```javascript
const { solver } = require("ctf-utils");

// RSA solver
const keyPair = await solver.RSA.generateKeyPair(2048);
const encrypted = solver.RSA.encrypt(65n, keyPair.publicKey);
const decrypted = solver.RSA.decrypt(encrypted, keyPair.privateKey);

// Forensics tools
const fileType = solver.Forensics.BinaryFile.detect(Buffer.from([0x89, 0x50, 0x4E, 0x47]));
const pngInfo = solver.Forensics.PNGCheck.check("image.png");

// Exploitation tools
const ropChain = solver.Exploitation.ROP.generateChain([
  { address: 0xdeadbeef, args: [0x1234, 0x5678] }
]);

// Math utilities
const gcd = solver.Math.gcd(12345n, 67890n);
const factors = solver.Math.pollardsRho(123456789n);

// Hash attacks
const hashType = solver.Crypto.Hash.analyzeHashType("d41d8cd98f00b204e9800998ecf8427e");
const cracked = solver.Crypto.Hash.bruteForceHash("5f4dcc3b5aa765d61d8327deb882cf99", "md5", "abcdefghijklmnopqrstuvwxyz", 8);
const saltedHash = solver.Crypto.Hash.hashWithSalt("password", "salt", "md5");
const hmac = solver.Crypto.Hash.generateHMAC("data", "key", "sha256");

// Binary analysis
const binaryType = solver.ReverseEngineering.BinaryAnalysis.detectBinaryType("binary.exe");
const headerInfo = solver.ReverseEngineering.BinaryAnalysis.analyzeBinaryHeader("binary.exe");
const strings = solver.ReverseEngineering.BinaryAnalysis.analyzeStrings("binary.exe");
const vulnerabilities = solver.ReverseEngineering.BinaryAnalysis.analyzeVulnerabilities("binary.exe");

// Web security
const jwtToken = solver.Web.Security.WebSecurity.parseJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
const jwtVerified = solver.Web.Security.WebSecurity.verifyJWT("token", "secret");
const jwtCracked = solver.Web.Security.WebSecurity.dictionaryCrackJWT("token", ["secret", "password"]);
const xssPayloads = solver.Web.Security.WebSecurity.generateEnhancedXSSPayloads("stored");
const sqlPayloads = solver.Web.Security.WebSecurity.generateEnhancedSQLInjectionPayloads();
const csrfAnalysis = solver.Web.Security.WebSecurity.analyzeCSRFToken("csrf-token");

// Lattice cryptography
const latticeBasis = solver.Crypto.Lattice.LatticeAttacks.generateLatticeBasis([[1, 2], [3, 4]]);
const lllResult = solver.Crypto.Lattice.LatticeAttacks.lllAlgorithm(latticeBasis);
const shortVector = solver.Crypto.Lattice.LatticeAttacks.findShortVector(latticeBasis);
const hastadResult = solver.Crypto.Lattice.LatticeAttacks.hastadBroadcastAttack([n1, n2, n3], [c1, c2, c3]);
```

## Development

```bash
# Install dependencies
pnpm install

# Build (TypeScript src → lib)
pnpm build

# Run tests
node test/run-all-tests.js
```

## Documentation

For more detailed documentation, please refer to the following files:

- **doc/CryptoTypes.md** - Detailed documentation for cryptographic types and encoding methods
- **doc/CryptoTypes-zh.md** - Chinese version of CryptoTypes documentation
- **doc/Solver.md** - Documentation for solver modules (RSA, Forensics, Exploitation, Math)
- **doc/Solver-zh.md** - Chinese version of Solver documentation
- **doc/README-zh.md** - Chinese version of this README

## Warning

The `detect` function indicates **possibility**, not certainty. A positive result means the input *could be* in that format.

## License

MIT
