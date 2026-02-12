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
- **Zero external dependencies** - Only core crypto and encoding modules

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

### RSA Solver

The RSA solver provides comprehensive tools for RSA cryptography challenges, including key generation, encryption/decryption, and common attacks.

#### RSA Features

- **Key generation** - Generate RSA key pairs with configurable bit lengths
- **Encryption/decryption** - Basic RSA encryption and decryption with CRT optimization
- **Common attacks** - Implementations of various RSA attack methods
- **Utility functions** - Prime detection, key strength evaluation, and more

#### RSA Usage Examples

```javascript
const { solver } = require("ctf-utils");

// Generate RSA key pair
const keyPair = await solver.RSA.RSASolver.generateKeyPair(512);
console.log(keyPair.publicKey);
console.log(keyPair.privateKey);

// Encrypt and decrypt message
const message = "Hello, RSA!";
const encrypted = solver.RSA.RSASolver.encrypt(message, keyPair.publicKey);
const decrypted = solver.RSA.RSASolver.decrypt(encrypted, keyPair.privateKey);
console.log(decrypted); // "Hello, RSA!"

// Evaluate key strength
const strength = solver.RSA.RSASolver.evaluateKeyStrength(keyPair.publicKey.n);
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

### File Analysis Tools

| Tool | Description |
|------|-------------|
| BinaryFile | File type detection via magic bytes |
| PNGCheck | PNG structure analysis & steganography detection |
| ZIPInfo | ZIP file analysis & pseudo-encryption detection |
| LSBExtract | Least Significant Bit steganography extraction |
| AudioSteganography | Audio file steganography analysis |

### Bacon Cipher

| Cipher | Detect | Decode | Encode | Description |
|--------|--------|--------|--------|-------------|
| Bacon | ✅ | ✅ | ✅ | Bacon's cipher (A/B or 0/1) |

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

### File Analysis Examples

```javascript
const { BinaryFile, PNGCheck, ZIPInfo, LSBExtract } = require("ctf-utils");
const fs = require("fs");

// Detect file type
const pngBuffer = fs.readFileSync("image.png");
const types = BinaryFile.detect(pngBuffer);
console.log(types); // ['png']

// Check PNG structure
const pngInfo = PNGCheck.check("image.png");
console.log(pngInfo);

// Analyze ZIP for pseudo-encryption
const zipInfo = ZIPInfo.analyze("file.zip");
console.log(zipInfo.hasPseudoEncryption);

// Extract LSB hidden data
const hiddenData = LSBExtract.extract("stego.png", 3, "LSB");
console.log(hiddenData);
```

### Frequency Analysis

```javascript
const { FrequencyAnalysis } = require("ctf-utils");

// Analyze character frequency
const result = FrequencyAnalysis.analyze("Hello World");
console.log(result.letters['H']); // Frequency of 'H'
console.log(result.ic);           // Index of Coincidence

// Find best XOR key
const xorResults = FrequencyAnalysis.bestXORKey("encrypted data");
console.log(xorResults[0]); // Most likely key and result
```

### Dictionary Generation

```javascript
const { DictionaryGenerator } = require("ctf-utils");

// Generate keyboard pattern passwords
const patterns = DictionaryGenerator.keyboardPatterns("qwerty", 3);

// Generate date-based passwords
const dates = DictionaryGenerator.datePatterns(2020, 2025);

// Generate combination dictionary
const combos = DictionaryGenerator.combine(["password", "123"], ["!", "@"]);
// ['password', '123', 'password!', 'password@', '123!', '123@']
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

## Warning

The `detect` function indicates **possibility**, not certainty. A positive result means the input *could be* in that format.

## License

MIT
