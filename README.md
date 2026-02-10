# CTF-UTILS

A Node.js based CTF toolkit for detecting, decoding, and encoding messages using various cryptographic and encoding methods.

## Features

- **40+ encoding/crypto methods** - Supports OCT, HEX, Base64, Unicode, Morse, Bacon, MD5, Caesar, ROT, ADFGVX, and more
- **TypeScript support** - Full type definitions included
- **Dual async/sync API** - Choose between async (Promise) or sync methods
- **CTFUtils class** - Chainable API for encoding/decoding operations
- **CLI tool** - Command-line interface for quick operations
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

| Type | Detect | Decode | Encode |
| :--- | :---: | :---: | :---: |
| OCT | ✅ | ✅ | ✅ |
| HEX | ✅ | ✅ | ✅ |
| Base64 | ✅ | ✅ | ✅ |
| Unicode | ✅ | ✅ | ✅ |
| Morse | ✅ | ✅ | ✅ |
| Bacon | ✅ | ✅ | ✅ |
| MD5 | ✅ | | ✅ |
| File Type | ✅ | | |
| Poem | ✅ | ✅ | |
| Caesar | | ✅ | ✅ |
| ROT5/13/47 | | ✅ | ✅ |
| Affine | | ✅ | ✅ |
| Exponential | ✅ | ✅ | |
| DangPu | ✅ | ✅ | |
| YuFoLunChan | ✅ | ✅ | |
| ZaHuoPu | ✅ | ✅ | |
| ADFGVX | ✅ | ✅ | ✅ |
| Vigenere | ✅ | ✅ | ✅ |
| RailFence | ✅ | ✅ | ✅ |
| Atbash | ✅ | ✅ | ✅ |
| SimpleSub | ✅ | ✅ | ✅ |
| URL | ✅ | ✅ | ✅ |
| HTML | ✅ | ✅ | ✅ |
| Binary String | ✅ | ✅ | ✅ |
| Decimal | ✅ | ✅ | ✅ |
| Brainfuck | ✅ | ✅ | ✅ |

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
