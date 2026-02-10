# CTF-UTILS API 文档

## 目录
- [快速开始](#快速开始)
- [detect 方法](#detect-方法)
- [decode 方法](#decode-方法)
- [encode 方法](#encode-方法)
- [示例代码](#示例代码)

## 目录
- [快速开始](#快速开始)
- [CTFUtils 类 (链式调用)](#ctfutils-类-链式调用)
- [detect 方法](#detect-方法)
- [decode 方法](#decode-方法)
- [encode 方法](#encode-方法)
- [示例代码](#示例代码)

## 快速开始

```javascript
const ctfUtils = require('./lib/index.js');
const { encode, decode, detect } = ctfUtils;

// 编码
const encoded = encode.HEX('Hello');
console.log(encoded); // 48656c6c6f

// 解码
const decoded = decode.HEX('48656c6c6f');
console.log(decoded); // Hello

// 检测
const result = detect.HEX('48656c6c6f');
console.log(result); // { HEX: true }
```

---

## CTFUtils 类 (链式调用)

推荐使用类实例化的方式调用 API，支持优雅的链式调用。

### 基本用法

```javascript
const { CTFUtils } = require('./lib/index.js');

const result = new CTFUtils('Hello')
    .encode.HEX()
    .val();

console.log(result); // 48656c6c6f
```

### 链式调用示例

```javascript
const { CTFUtils } = require('./lib/index.js');

const result = new CTFUtils('Hello World')
    .encode.Base64()
    .encode.HEX()
    .val();

console.log(result); // 5348477634473d
```

### 获取中间结果

```javascript
const { CTFUtils } = require('./lib/index.js');

const instance = new CTFUtils('Hello');

// 获取当前值
console.log(instance.val()); // Hello

// 执行编码
instance.encode.Base64();

// 获取当前值
console.log(instance.val()); // SGVsbG8=
```

### 文本处理方法

#### val() - 获取当前值
```javascript
const { CTFUtils } = require('./lib/index.js');

const result = new CTFUtils('Hello World').val();
console.log(result); // 'Hello World'
```

#### slice() - 字符串切片
```javascript
const { CTFUtils } = require('./lib/index.js');

const result = new CTFUtils('Hello World')
    .slice(0, 5)
    .val();

console.log(result); // 'Hello'
```

#### replace() - 字符串替换
```javascript
const { CTFUtils } = require('./lib/index.js');

const result = new CTFUtils('Hello World')
    .replace('World', 'CTF')
    .val();

console.log(result); // 'Hello CTF'
```

### 完整链式调用示例

```javascript
const { CTFUtils } = require('./lib/index.js');

// 示例1: 编码 + 文本处理
const encoded = new CTFUtils('Hello World')
    .encode.Base64()
    .replace('=', '')
    .val();

console.log(encoded); // 'SGVsbG8gV29ybGQ'

// 示例2: 多步编码
const multiStep = new CTFUtils('Secret')
    .encode.MD5()
    .encode.HEX()
    .val();

console.log(multiStep); // 加密后的值

// 示例3: 解码 + 切片
const decoded = new CTFUtils('SGVsbG8gV29ybGQ=')
    .decode.Base64()
    .slice(0, 5)
    .val();

console.log(decoded); // 'Hello'

// 示例4: 检测当前值
const instance = new CTFUtils('.... . .-.. .-.. ---');
const isMorse = instance.detect.Morse();
console.log(isMorse); // true

console.log(instance.val()); // '.... . .-.. .-.. ---'
```

### 构造函数参数

```javascript
const { CTFUtils } = require('./lib/index.js');

// 方式1: 直接传入初始值
const utils1 = new CTFUtils('Hello');

// 方式2: 传入初始值和默认参数
const utils2 = new CTFUtils('Hello', 3); // Caesar 默认移位3
const result = utils2.encode.Caesar().val(); // 'Khoor'

// 方式3: 链式调用中覆盖参数
const result2 = new CTFUtils('Hello')
    .encode.Caesar(5) // 移位5
    .val();

console.log(result2); // 'Mjqqt'
```

### detect 返回值说明

```javascript
const { CTFUtils } = require('./lib/index.js');

// detect 方法返回检测结果，不会改变当前值
const instance = new CTFUtils('.... . .-.. .-.. ---');

const isMorse = instance.detect.Morse();
console.log(isMorse); // true

console.log(instance.val()); // '.... . .-.. .-.. ---' (值未改变)
```

### 组合使用模式

```javascript
const { CTFUtils } = require('./lib/index.js');

// 模式1: 编码链
const encodeChain = (text) => {
    return new CTFUtils(text)
        .encode.Base64()
        .encode.HEX()
        .val();
};

// 模式2: 解码链
const decodeChain = (encoded) => {
    return new CTFUtils(encoded)
        .decode.HEX()
        .decode.Base64()
        .val();
};

// 模式3: 检测并解码
const autoDecode = (text) => {
    const instance = new CTFUtils(text);
    
    if (instance.detect.Morse()) {
        return instance.decode.Morse().val();
    }
    if (instance.detect.Base64()) {
        return instance.decode.Base64().val();
    }
    if (instance.detect.HEX()) {
        return instance.decode.HEX().val();
    }
    
    return text;
};
```

---

## detect 方法

检测输入字符串是否符合某种编码格式，返回布尔值或检测结果对象。

### 支持的检测类型

#### 1. HEX 检测
```javascript
detect.HEX(str: string): boolean
```
**示例：**
```javascript
detect.HEX('48656c6c6f');  // true
detect.HEX('Hello');        // false
```

#### 2. Base64 检测
```javascript
detect.Base64(str: string): boolean
```
**示例：**
```javascript
detect.Base64('SGVsbG8=');      // true
detect.Base64('Hello');         // false
```

#### 3. Base32 检测
```javascript
detect.Base32(str: string): boolean
```
**示例：**
```javascript
detect.Base32('JBSWY3DPEHPK3PXP');  // true
```

#### 4. Base16 检测
```javascript
detect.Base16(str: string): boolean
```
**示例：**
```javascript
detect.Base16('48656C6C6F');  // true
```

#### 5. Base58 检测
```javascript
detect.Base58(str: string): boolean
```
**示例：**
```javascript
detect.Base58('2gzeX');  // true
```

#### 6. Base62 检测
```javascript
detect.Base62(str: string): boolean
```
**示例：**
```javascript
detect.Base62('3E8');  // true
```

#### 7. Base85 检测
```javascript
detect.Base85(str: string): boolean
```
**示例：**
```javascript
detect.Base85('BOu!rDZ');  // true
```

#### 8. Base91 检测
```javascript
detect.Base91(str: string): boolean
```
**示例：**
```javascript
detect.Base91('TWi~');  // true
```

#### 9. Binary (BinStr) 检测
```javascript
detect.BinStr(str: string): boolean
```
**示例：**
```javascript
detect.BinStr('01001000 01100101');  // true
detect.BinStr('01001000');           // false (长度至少8位)
```

#### 10. OCT 检测
```javascript
detect.OCT(str: string): boolean
```
**示例：**
```javascript
detect.OCT('110 145 154 154');  // true
```

#### 11. Decimal 检测
```javascript
detect.Decimal(str: string): boolean
```
**示例：**
```javascript
detect.Decimal('72 101 108 108 111');  // true
detect.Decimal('72,101,108');           // true
```

#### 12. Morse 检测
```javascript
detect.Morse(str: string): boolean
```
**示例：**
```javascript
detect.Morse('.... . .-.. .-.. ---');  // true
detect.Morse('.-.-');                   // true
```

#### 13. Bacon 检测
```javascript
detect.Bacon(str: string): boolean
```
**示例：**
```javascript
detect.Bacon('AAAA ABABA ABBAB');  // true
detect.Bacon('aaaaa aabab');        // true
```

#### 14. Affine 检测
```javascript
detect.Affine(str: string): boolean
```
**示例：**
```javascript
detect.Affine('hello world');  // true
detect.Affine('12345');       // false
```

#### 15. Atbash 检测
```javascript
detect.Atbash(str: string): boolean
```
**示例：**
```javascript
detect.Atbash('ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba');  // true
```

#### 16. ROT 检测
```javascript
// 无专门检测函数，使用通用检测或组合 detect 使用
```

#### 17. Caesar 检测
```javascript
// 无专门检测函数
```

#### 18. Vigenere 检测
```javascript
// 无专门检测函数
```

#### 19. URL 检测
```javascript
detect.URL(str: string): boolean
```
**示例：**
```javascript
detect.URL('Hello%20World');        // true
detect.URL('%E4%B8%AD%E6%96%87');   // true
```

#### 20. Unicode 检测
```javascript
detect.Unicode(str: string): boolean
```
**示例：**
```javascript
detect.Unicode('\\u0048\\u0065\\u006c\\u006c\\u006f');  // true
detect.Unicode('&#72;&#101;&#108;&#108;&#111;');          // true
detect.Unicode('&#x48;&#x65;&#x6c;&#x6c;&#x6f;');       // true
```

#### 21. MD5 检测
```javascript
detect.MD5(str: string): boolean
```
**示例：**
```javascript
detect.MD5('5d41402abc4b2a76b9719d911017c592');  // true (32位十六进制)
detect.MD5('hello');                              // false
```

#### 22. 全部检测
```javascript
detect.detectAll(str: string): object
```
**示例：**
```javascript
const result = detect.detectAll('.... . .-.. .-.. ---');
// { HEX: false, OCT: false, Morse: true, ... }
```

---

## decode 方法

将编码后的字符串解码为原始文本。

### 支持的解码类型

#### 1. HEX 解码
```javascript
decode.HEX(str: string, type?: number): string | Buffer
```
| 参数 | 类型 | 说明 |
|------|------|------|
| str | string | 要解码的 HEX 字符串 |
| type | number | 0: 返回字符串 (默认), 1: 返回 Buffer |

**示例：**
```javascript
decode.HEX('48656c6c6f');                     // 'Hello'
decode.HEX('48656c6c6f', 0);                   // 'Hello'
decode.HEX('48656c6c6f', 1);                   // <Buffer 48 65 6c 6c 6f>
decode.HEX('48 65 6c 6c 6f');                  // 'Hello' (自动去除空格)
```

#### 2. Base64 解码
```javascript
decode.Base64(str: string, type?: number): string | Buffer
```
| 参数 | 类型 | 说明 |
|------|------|------|
| str | string | 要解码的 Base64 字符串 |
| type | number | 0: 返回字符串 (默认), 1: 返回 Buffer |

**示例：**
```javascript
decode.Base64('SGVsbG8=');       // 'Hello'
decode.Base64('SGVsbG8=', 0);    // 'Hello'
decode.Base64('SGVsbG8=', 1);    // <Buffer 48 65 6c 6c 6f>
```

#### 3. Base32 解码
```javascript
decode.Base32(str: string): string
```
**示例：**
```javascript
decode.Base32('JBSWY3DPEHPK3PXP');  // 'HelloWorld'
```

#### 4. Base16 解码
```javascript
decode.Base16(str: string): string
```
**示例：**
```javascript
decode.Base16('48656C6C6F');  // 'Hello'
```

#### 5. Base58 解码
```javascript
decode.Base58(str: string): string
```
**示例：**
```javascript
decode.Base58('2gzeX');  // '123'
```

#### 6. Base62 解码
```javascript
decode.Base62(str: string): string
```
**示例：**
```javascript
decode.Base62('3E8');  // '123'
```

#### 7. Base85 解码
```javascript
decode.Base85(str: string): string
```
**示例：**
```javascript
decode.Base85('BOu!rDZ');  // 'Hello'
```

#### 8. Base91 解码
```javascript
decode.Base91(str: string): string
```
**示例：**
```javascript
decode.Base91('TWi~');  // 'Hello'
```

#### 9. Binary (BinStr) 解码
```javascript
decode.BinStr(str: string, separator?: string): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| str | string | 要解码的二进制字符串 |
| separator | string | 分隔符，默认空格 |

**示例：**
```javascript
decode.BinStr('01001000 01100101');              // 'He'
decode.BinStr('0100100001100101');               // 'He' (无空格时每8位一组)
decode.BinStr('01001000,01100101', ',');         // 'He'
```

#### 10. OCT 解码
```javascript
decode.OCT(str: string): string
```
**示例：**
```javascript
decode.OCT('110 145 154 154 157');  // 'Hello'
decode.OCT('110/145/154', '/');    // 'He' (部分解码)
```

#### 11. Decimal 解码
```javascript
decode.Decimal(str: string, separator?: string): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| str | string | 要解码的数字字符串 |
| separator | string | 分隔符，默认空格 |

**示例：**
```javascript
decode.Decimal('72 101 108 108 111');  // 'Hello'
decode.Decimal('72,101,108', ',');     // 'He'
```

#### 12. Morse 解码
```javascript
decode.Morse(str: string, opt?: object): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| str | string | 要解码的摩斯电码 |
| opt | object | 可选，替换 A/B 或 0/1 的映射 |

**示例：**
```javascript
decode.Morse('.... . .-.. .-.. ---');                    // 'hello'
decode.Morse('.... . .-.. .-.. ---', {'A': '0', 'B': '1'});  // 'hello' (使用0/1替代./-)
```

#### 13. Bacon 解码
```javascript
decode.Bacon(str: string): string
```
**示例：**
```javascript
decode.Bacon('AAAA ABABA ABBAB');  // 'HEL'
decode.Bacon('aaaaa aabab');       // 'HE'
```

#### 14. Caesar 解码
```javascript
decode.Caesar(input: string | Buffer, type?: number | string): string | Buffer
```
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string \| Buffer | 要解码的文本 |
| type | number \| string | 移位数或预设类型 |

**预设类型：**
- `"Avocat"`: 移位 10
- `"ROT13"`: 移位 13
- `"Cassis"`: 移位 -5
- `"Cassette"`: 移位 -6

**示例：**
```javascript
decode.Caesar('Khoor', 3);           // 'Hello'
decode.Caesar('Khoor', 'Avocat');     // 'Aewwi' (移位10)
decode.Caesar('uryyb', 'ROT13');      // 'hello'
```

#### 15. ROT 解码
```javascript
decode.ROT(input: string | Buffer, type?: number): string | Buffer
```
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string \| Buffer | 要解码的文本 |
| type | number | ROT 类型 |

**ROT 类型：**
- `13`: ROT13 (英文字母)
- `5`: ROT5 (数字)
- `47`: ROT47 (可打印 ASCII)

**示例：**
```javascript
decode.ROT('uryyb', 13);           // 'hello'
decode.ROT('67890', 5);            // '12345'
decode.ROT('%3C 7? 56:', 47);      // 'Hello'
```

#### 16. Atbash 解码
```javascript
decode.Atbash(input: string): string
```
**示例：**
```javascript
decode.Atbash('SVOOL');  // 'Hello'
decode.Atbash('svool');  // 'hello'
```

#### 17. Vigenere 解码
```javascript
decode.Vigenere(input: string | Buffer, key: string): string | Buffer
```
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string \| Buffer | 要解码的文本 |
| key | string | 解密密钥 |

**示例：**
```javascript
decode.Vigenere('RIJVS', 'KEY');  // 'HELLO'
decode.Vigenere('Ppq nj!', 'abc'); // 'Hello World!'
```

#### 18. Affine 解码
```javascript
decode.Affine(input: string, options: AffineOptions): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string | 要解码的文本 |
| options | object | 解密参数 |

**AffineOptions：**
```typescript
interface AffineOptions {
    a: number;      // 乘法密钥 (与26互质)
    b: number;      // 加法密钥
    i?: number;     // 可选，a的模逆
    mode?: string;  // "upper" 或 "lower"
    bf?: boolean;   // 是否使用暴力法
}
```

**示例：**
```javascript
decode.Affine('RCLLA', {a: 5, b: 8});           // 'HELLO'
decode.Affine('rclla', {a: 5, b: 8, mode: 'lower'});  // 'hello'
```

#### 19. RailFence 解码
```javascript
decode.RailFence(input: string, rails: number): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string | 编码后的文本 |
| rails | number | 轨道数 |

**示例：**
```javascript
decode.RailFence('Hooelllr', 3);  // 'Hello World'
```

#### 20. URL 解码
```javascript
decode.URL(input: string): string
```
**示例：**
```javascript
decode.URL('Hello%20World');            // 'Hello World'
decode.URL('%E4%B8%AD%E6%96%87');      // '中文'
```

#### 21. Unicode 解码
```javascript
decode.Unicode(str: string): string
```
**支持的格式：**
- `\uXXXX` - 4位十六进制
- `&#XXXXX;` - 十进制数字引用
- `&#xXXXX;` - 十六进制数字引用

**示例：**
```javascript
decode.Unicode('\\u0048\\u0065\\u006c\\u006c\\u006f');  // 'Hello'
decode.Unicode('&#72;&#101;&#108;&#108;&#111;');        // 'Hello'
decode.Unicode('&#x48;&#x65;&#x6c;&#x6c;&#x6f;');     // 'Hello'
```

#### 22. Exponential 解码
```javascript
decode.Exponential(str: string): string
```
**示例：**
```javascript
decode.Exponential('2 0123 123 0123');  // 解密结果
```

#### 23. DangPu 解码
```javascript
decode.DangPu(str: string): string
```
**示例：**
```javascript
decode.DangPu('由工王 由大工');  // 解密结果
```

#### 24. ZaHuoPu 解码
```javascript
decode.ZaHuoPu(str: string): string
```
**示例：**
```javascript
decode.ZaHuoPu('兔子兔子乌龟兔子');  // 解密结果
```

#### 25. Poem 解码
```javascript
decode.Poem(str: string): string
```
**示例：**
```javascript
decode.Poem(str);  // 根据藏头诗规则解密
```

---

## encode 方法

将原始文本编码为指定格式。

### 支持的编码类型

#### 1. HEX 编码
```javascript
encode.HEX(str: string): string
```
**示例：**
```javascript
encode.HEX('Hello');  // '48656c6c6f'
```

#### 2. Base64 编码
```javascript
encode.Base64(str: string): string
```
**示例：**
```javascript
encode.Base64('Hello');  // 'SGVsbG8='
```

#### 3. Base32 编码
```javascript
encode.Base32(str: string): string
```
**示例：**
```javascript
encode.Base32('HelloWorld');  // 'JBSWY3DPEHPK3PXP'
```

#### 4. Base16 编码
```javascript
encode.Base16(str: string): string
```
**示例：**
```javascript
encode.Base16('Hello');  // '48656C6C6F'
```

#### 5. Base58 编码
```javascript
encode.Base58(str: string): string
```
**示例：**
```javascript
encode.Base58('123');  // '2gzeX'
```

#### 6. Base62 编码
```javascript
encode.Base62(str: string): string
```
**示例：**
```javascript
encode.Base62('123');  // '3E8'
```

#### 7. Base85 编码
```javascript
encode.Base85(str: string): string
```
**示例：**
```javascript
encode.Base85('Hello');  // 'BOu!rDZ'
```

#### 8. Base91 编码
```javascript
encode.Base91(str: string): string
```
**示例：**
```javascript
encode.Base91('Hello');  // 'TWi~'
```

#### 9. Binary (BinStr) 编码
```javascript
encode.BinStr(str: string, separator?: string): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| str | string | 要编码的文本 |
| separator | string | 分隔符，默认空格 |

**示例：**
```javascript
encode.BinStr('He');                    // '01001000 01100101'
encode.BinStr('He', ',');               // '01001000,01100101'
encode.BinStr('He', '');                // '0100100001100101'
```

#### 10. OCT 编码
```javascript
encode.OCT(str: string): string
```
**示例：**
```javascript
encode.OCT('Hello');  // '110 145 154 154 157'
```

#### 11. Decimal 编码
```javascript
encode.Decimal(str: string, separator?: string): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| str | string | 要编码的文本 |
| separator | string | 分隔符，默认空格 |

**示例：**
```javascript
encode.Decimal('abc');       // '97 98 99'
encode.Decimal('abc', ',');  // '97,98,99'
```

#### 12. Morse 编码
```javascript
encode.Morse(str: string): string
```
**示例：**
```javascript
encode.Morse('HELLO');                    // '.... . .-.. .-.. ---'
encode.Morse('HELLO WORLD');              // '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'
```

#### 13. Bacon 编码
```javascript
encode.Bacon(str: string): string
```
**示例：**
```javascript
encode.Bacon('HEL');  // 'AAAA ABABA ABBAB'
```

#### 14. Caesar 编码
```javascript
encode.Caesar(input: string | Buffer, type?: number | string): string | Buffer
```
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string \| Buffer | 要编码的文本 |
| type | number \| string | 移位数或预设类型 |

**示例：**
```javascript
encode.Caesar('Hello', 3);           // 'Khoor'
encode.Caesar('Hello', 'ROT13');     // 'Uryyb'
encode.Caesar('Hello', 'Avocat');    // 'Rovvy' (移位10)
```

#### 15. ROT 编码
```javascript
encode.ROT(input: string | Buffer, type?: number): string | Buffer
```
**示例：**
```javascript
encode.ROT('hello', 13);  // 'uryyb'
encode.ROT('12345', 5);   // '67890'
encode.ROT('Hello', 47);  // '%3C 7? 56:'
```

#### 16. Atbash 编码
```javascript
encode.Atbash(input: string): string
```
**示例：**
```javascript
encode.Atbash('Hello');  // 'SVOOL'
encode.Atbash('hello');  // 'svool'
```

#### 17. Vigenere 编码
```javascript
encode.Vigenere(input: string | Buffer, key: string): string | Buffer
```
**示例：**
```javascript
encode.Vigenere('HELLO', 'KEY');    // 'RIJVS'
encode.Vigenere('Hello World!', 'abc');  // 'Ppq nj!'
```

#### 18. Affine 编码
```javascript
encode.Affine(input: string, options: AffineOptions): string
```
**示例：**
```javascript
encode.Affine('HELLO', {a: 5, b: 8});  // 'RCLLA'
encode.Affine('hello', {a: 5, b: 8, mode: 'lower'});  // 'rclla'
```

#### 19. RailFence 编码
```javascript
encode.RailFence(input: string, rails: number): string
```
**示例：**
```javascript
encode.RailFence('Hello World', 3);  // 'Hooelllr'
```

#### 20. URL 编码
```javascript
encode.URL(input: string): string
```
**示例：**
```javascript
encode.URL('Hello World');     // 'Hello%20World'
encode.URL('中文');            // '%E4%B8%AD%E6%96%87'
```

#### 21. Unicode 编码
```javascript
encode.Unicode(str: string, type?: number): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| str | string | 要编码的文本 |
| type | number | 编码类型 (1: \uXXXX, 2: &#XXXXX;, 3: &#xXXXX;) |

**示例：**
```javascript
encode.Unicode('Hello', 1);  // '\\u0048\\u0065\\u006c\\u006c\\u006f'
encode.Unicode('Hello', 2);  // '&#72;&#101;&#108;&#108;&#111;'
encode.Unicode('Hello', 3);  // '&#x48;&#x65;&#x6c;&#x6c;&#x6f;'
encode.Unicode('Hello');     // 默认 type=1
```

#### 22. MD5 编码
```javascript
encode.MD5(str: string): string
```
**示例：**
```javascript
encode.MD5('Hello');  // '8b1a9953c4611296a827abf8c47804d7'
```

---

## 示例代码

### 完整使用示例

```javascript
const ctfUtils = require('./lib/index.js');
const { encode, decode, detect } = ctfUtils;

console.log('=== CTF-UTILS 使用示例 ===\n');

// 1. 基础编码解码
console.log('【基础编码解码】');
const text = 'Hello';
const hex = encode.HEX(text);
console.log(`原文: ${text}`);
console.log(`HEX编码: ${hex}`);
console.log(`HEX解码: ${decode.HEX(hex)}\n`);

// 2. 多种编码格式
console.log('【Base系列编码】');
const base64 = encode.Base64(text);
const base32 = encode.Base32(text);
const base16 = encode.Base16(text);
console.log(`Base64: ${base64}`);
console.log(`Base32: ${base32}`);
console.log(`Base16: ${base16}\n`);

// 3. 古典密码
console.log('【古典密码】');
const caesar = encode.Caesar(text, 3);
const atbash = encode.Atbash(text);
const vigenere = encode.Vigenere(text, 'KEY');
console.log(`Caesar(移位3): ${caesar}`);
console.log(`Atbash: ${atbash}`);
console.log(`Vigenere(KEY): ${vigenere}`);
console.log(`Caesar解码: ${decode.Caesar(caesar, 3)}`);
console.log(`Atbash解码: ${decode.Atbash(atbash)}`);
console.log(`Vigenere解码: ${decode.Vigenere(vigenere, 'KEY')}\n`);

// 4. 检测功能
console.log('【自动检测】');
const unknown = '.... . .-.. .-.. ---';
const allResult = detect.detectAll(unknown);
console.log(`检测 "${unknown}":`);
console.log(JSON.stringify(allResult, null, 2));
```

### 摩斯电码示例

```javascript
const { encode, decode, detect } = ctfUtils;

// 编码
const morse = encode.Morse('SOS');
console.log(encode.Morse('SOS'));  // '... --- ...'

// 解码
decode.Morse('... --- ...');  // 'sos'

// 检测
detect.Morse('... --- ...');  // true
```

### 二进制字符串示例

```javascript
const { encode, decode, detect } = ctfUtils;

// 编码
encode.BinStr('Hi');  // '01001000 01101001'

// 解码
decode.BinStr('01001000');  // 'H'

// 检测
detect.BinStr('01001000');  // true
```

### 组合使用示例

```javascript
const { encode, decode } = ctfUtils;

// 链式编码解码
const original = 'Secret';
const step1 = encode.Base64(original);
const step2 = encode.HEX(step1);
console.log(`原文: ${original}`);
console.log(`Base64: ${step1}`);
console.log(`HEX: ${step2}`);

// 逆向解码
const back2 = decode.HEX(step2);
const back1 = decode.Base64(back2);
console.log(`还原: ${back1}`);
```

---

## 注意事项

1. **Affine 密码**：a 必须与 26 互质（可用的 a 值：1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25）

2. **RailFence**：rails 参数必须大于 1 才能生效

3. **MD5**：只有编码功能，没有对应的 decode 方法

4. **异常处理**：某些解码函数在输入无效时可能返回空字符串或原始输入

5. **Buffer 支持**：部分函数支持 Buffer 类型的输入输出
