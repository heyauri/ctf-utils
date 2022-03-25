# CTF-UTILS
--- 

A NodeJs based ctf-utils package.

## 1. Installation
```cmd
    npm install ctf-utils
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