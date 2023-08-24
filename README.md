# CTF-UTILS
--- 

A NodeJs based ctf-utils package, which can be used to detect/decode/encode messages under some CTF related crypto/encoding manner.

## 1. Installation

### As a package
```bash
npm install ctf-utils
```
then
```javascript
const ctfUtils = require("ctf-utils");
```
### As a cli
```bash
npm install -g ctf-utils
```
then
```bash
ctf-utils detect '636A56355279427363446C4A49454A71545342'
```

## 2. Usage

### Detect | Decode | Encode

Detect/Decode/Encode all possible encrypt types of an input context.

|   Types   | Detect | Decode | Encode |
| :-------: | :----: | :----: | :----: |
|    OCT    |   ✅    |   ✅    |   ✅    |
|    HEX    |   ✅    |   ✅    |   ✅    |
|  Base64   |   ✅    |   ✅    |   ✅    |
|  Unicode  |   ✅    |   ✅    |   ✅    |
|   Morse   |   ✅    |   ✅    |   ✅    |
|   Bacon   |   ✅    |   ✅    |   ✅    |
|    MD5    |   ✅    |        |   ✅    |
| File Type |   ✅    |        |        |
| Poem Code |   ✅    |   ✅    |        |
|   ROT13   |        |   ✅    |   ✅    |
| 幂数密码  |   ✅    |   ✅    |        |
| 当铺密码  |   ✅    |   ✅    |        |
| 与佛论禅  |   ✅    |   ✅    |        |

Example:
```javascript
    const ctfUtils = require("ctf-utils");

    // Detect
    ctfUtils.detect.OCT("146 154 141 147");
    // Out: True

    // Decode
    ctfUtils.decode.OCT("146 154 141 147");
    // Out: flag
```

The Unicode Encode including 3 types: "\uxxxx","&#xxxx","&#x****".

## Warning

If the `detect` function return `true` of any encrypt types, it only shows a possibility, not a certainty.