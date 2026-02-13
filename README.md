# CTF-UTILS

A Node.js based CTF toolkit for detecting, decoding, and encoding messages using various cryptographic and encoding methods.

## Features

- **60+ encoding/crypto methods** - Comprehensive support for classical ciphers, modern encodings, and steganography tools
- **TypeScript support** - Full type definitions included
- **Dual async/sync API** - Choose between async (Promise) or sync methods
- **CTFUtils class** - Chainable API for encoding/decoding operations
- **CLI tool** - Command-line interface for quick operations
- **File analysis tools** - LSB steganography, PNG structure analysis, ZIP pseudo-encryption detection
- **RSA solver** - Advanced RSA cryptography tools with support for key generation, encryption/decryption, and common attacks
- **Forensics tools** - File analysis and steganography detection utilities
- **Exploitation tools** - Binary vulnerability exploitation utilities
- **Math utilities** - Advanced mathematical functions for cryptography
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

### Utility Functions

| Function | Detect | Description |
|----------|--------|-------------|
| XOR | ✅ | XOR encryption/brute-force |
| FrequencyAnalysis | | Character frequency analysis |
| DictionaryGenerator | | Password dictionary generation |
| AES/DES | | AES-128/192/256 and DES encryption |

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
| bonehDurfee | Boneh-Durfee attack for small private exponent |
| coppersmith | Coppersmith's attack for small roots of polynomials |
| coppersmithFactor | Coppersmith's attack for factoring with partial information |
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
