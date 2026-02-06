# CTF-UTILS

A Node.js based CTF toolkit for detecting, decoding, and encoding messages using various cryptographic and encoding methods.

## Features

- **40+ encoding/crypto methods** - Supports OCT, HEX, Base64, Unicode, Morse, Bacon, MD5, Caesar, ROT, and more
- **TypeScript support** - Full type definitions included
- **Dual usage** - Use as a library or CLI tool
- **Zero dependencies** - Only core crypto and encoding modules

## Installation

### As a package

```bash
npm install ctf-utils
# or
pnpm add ctf-utils
```

```javascript
const ctfUtils = require("ctf-utils");

// ES modules
import * as ctfUtils from "ctf-utils";
```

### As a CLI

```bash
npm install -g ctf-utils
ctf-utils detect '636A56355279427363446C4A49454A71545342'
```

## Quick Start

```javascript
const { detect, decode, encode, OCT, Morse, Affine } = require("ctf-utils");

// Detect encoding type
detect.OCT("146 154 141 147");     // true
detect.Morse(".... . .-.. .-.. ---");  // true

// Decode
decode.OCT("146 154 141 147");     // "flag"
decode.Morse(".... . .-.. .-.. ---");  // "hello"

// Encode
encode.Base64("hello");            // "aGVsbG8="

// Direct module access
Affine.encode("hello", 5, 8);      // "xubbeg"
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

## Development

```bash
# Install dependencies
pnpm install

# Build (TypeScript src → dist)
pnpm build

# Type check
pnpm tsc --noEmit
```

## Warning

The `detect` function indicates **possibility**, not certainty. A positive result means the input *could be* in that format.

## License

MIT
