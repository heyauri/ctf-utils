# CTF-UTILS API 文档

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

#### 22. BinaryFile 文件类型检测
```javascript
detect.BinaryFile(buf: Buffer | string, mode?: string): string[]
```
| 参数 | 类型 | 说明 |
|------|------|------|
| buf | Buffer \| string | 文件内容或十六进制字符串 |
| mode | string | "fast": 仅检测文件头 (默认), "full": 全文件检测 |

**示例：**
```javascript
const fs = require('fs');
const buf = fs.readFileSync('image.png');
detect.BinaryFile(buf);
// ['png']

detect.BinaryFile('89504E470D0A1A0A', 'fast');
// ['png']
```

**支持的文件类型：**
| 文件头 | 文件类型 |
|--------|----------|
| FFD8FF | jpg |
| 89504E47 | png |
| 47494638 | gif |
| 49492A00 | tif |
| 424D | bmp |
| 504B0304 | zip / docx / xlsx |
| 52617221 | rar |
| 255044462D312E | pdf |
| 57415645 | wav |
| 41564920 | avi |
| 000001BA | mpg |
| 6D6F6F76 | mov |
| 3026B2758E66CF11 | asf |
| 4D546864 | mid |
| 68746D6C3E | html |
| 3C3F786D6C | xml |
| 44656C69766572792D646174653A | eml |

#### 23. Polybius 坐标检测
```javascript
detect.Polybius(str: string): boolean
```
**示例：**
```javascript
detect.Polybius('11 45 23 15');  // true
detect.Polybius('hello');         // false
```

#### 24. XOR 工具检测
```javascript
detect.XOR(input: string | Buffer): boolean
```
**示例：**
```javascript
detect.XOR('Hello');         // true
detect.XOR(Buffer.from([1,2,3]));  // true
```

#### Playfair 密码检测
```javascript
detect.Playfair(str: string): boolean
```
**示例：**
```javascript
detect.Playfair('DBNVMI');  // true
detect.Playfair('Hello');    // false
```

---

## Playfair 密码 (新增)

Playfair 密码是一种双字母代换密码，使用 5x5 密钥矩阵进行加密/解密。

### 检测
```javascript
detect.Playfair(str: string): boolean
```
**示例：**
```javascript
detect.Playfair('DBNVMI');  // true
detect.Playfair('Hello');    // false
```

### 加密
```javascript
encode.Playfair(input: string, key: string): string
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string | 要加密的明文 |
| key | string | 密钥 |

**描述：** 使用 5x5 密钥矩阵进行双字母加密（自动处理重复字母和填充 X）。

**示例：**
```javascript
encode.Playfair('HELLO', 'KEY');
// 'DBNVMI'
encode.Playfair('WORLD', 'KEY');
// 'ZMQMGV'
```

### 解密
```javascript
decode.Playfair(input: string, key: string): string
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string | 要解密的密文 |
| key | string | 密钥 |

**示例：**
```javascript
decode.Playfair('DBNVMI', 'KEY');
// 'HELLO'
decode.Playfair('ZMQMGV', 'KEY');
// 'WORLD'
```

### CTFUtils 链式调用示例
```javascript
const { CTFUtils } = require('./lib/index.js');

await new CTFUtils('HELLO', 'KEY')
    .encode.Playfair()
    .val();
// 'DBNVMI'

new CTFUtils('DBNVMI', 'KEY')
    .decodeSync.Playfair()
    .val();
// 'HELLO'
```

---

## XOR 加密工具 (新增)

提供 XOR 加密、暴力破解和密钥检测功能。

### 检测
```javascript
detect.XOR(input: string | Buffer): boolean
```
**示例：**
```javascript
detect.XOR('Hello');         // true
detect.XOR(Buffer.from([1,2,3]));  // true
```

### 单字节 XOR 加密/解密
```javascript
encode.XOR(input: string | Buffer, key: number | string): string | Buffer
decode.XOR(input: string | Buffer, key: number | string): string | Buffer
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string | Buffer | 输入文本或字节 |
| key | number | string | 单字节密钥 (0-255) |

**示例：**
```javascript
// 加密
encode.XOR('Hello', 0x42);
// '1elsm'

// 解密
decode.XOR(encode.XOR('Hello', 0x42), 0x42);
// 'Hello'

// 使用 Buffer
encode.XOR(Buffer.from('Hello'), 0x42);
// Buffer<31 65 6c 73 6d>
```

### 多字节 XOR 加密/解密
```javascript
XOR(input: string | Buffer, key: Buffer): string | Buffer
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string | Buffer | 输入文本或字节 |
| key | Buffer | 多字节密钥 |

**示例：**
```javascript
const key = Buffer.from([1, 2, 3]);
XOR('Hello World', key);
// 加密结果

XOR(XOR('Hello World', key), key);
// 'Hello World'
```

### 暴力破解单字节 XOR
```javascript
bruteXOR(input: string | Buffer, maxResults?: number): { key: number; result: string }[]
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string | Buffer | 加密的输入 |
| maxResults | number | 最大返回结果数 (默认 10) |

**描述：** 尝试所有 0-255 的密钥，返回所有可打印结果（按可能性排序）。

**示例：**
```javascript
const encrypted = encode.XOR('Hello', 0x42);
const results = bruteXOR(encrypted);

console.log('找到', results.length, '个可能结果:');
results.forEach(r => {
    console.log(`Key: ${r.key}, Result: "${r.result}"`);
});
```

### 暴力破解多字节 XOR
```javascript
bruteXORMulti(input: string | Buffer, keyLength: number, maxResults?: number): { key: Buffer; result: string }[]
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string | Buffer | 加密的输入 |
| keyLength | number | 猜测的密钥长度 |
| maxResults | number | 最大返回结果数 (默认 5) |

**示例：**
```javascript
const encrypted = XOR('Hello World', Buffer.from([1,2,3]));
const results = bruteXORMulti(encrypted, 3);

results.forEach(r => {
    console.log(`Key: [${r.key.join(', ')}], Result: "${r.result}"`);
});
```

### 最佳密钥猜测 (基于频率分析)
```javascript
bestXORKey(input: string | Buffer, keyLength?: number): { key: number | Buffer; result: string; score: number }[]
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string | Buffer | 加密的输入 |
| keyLength | number | 密钥长度 (默认 1) |

**描述：** 基于字符频率分析找出最可能的密钥。

**示例：**
```javascript
const encrypted = encode.XOR('Hello World', 0x42);
const best = bestXORKey(encrypted, 1);

console.log('最佳密钥:', best[0].key);
console.log('解密结果:', best[0].result);
console.log('评分:', best[0].score);
```

---

## 频率分析工具 (新增)

提供字符频率统计和索引重合分析功能。

### 字符频率分析
```javascript
FrequencyAnalysis.analyze(text: string): {
    letters: { [char: string]: number },
    bigrams: { [bigram: string]: number },
    trigrams: { [trigram: string]: number },
    ic: number,
    chiSquared: number
}
```
**返回值：**
| 字段 | 类型 | 说明 |
|------|------|------|
| letters | object | 单字符频率统计 |
| bigrams | object | 双字符组合频率 |
| trigrams | object | 三字符组合频率 |
| ic | number | Index of Coincidence (重合指数) |
| chiSquared | number | 卡方统计值 |

**示例：**
```javascript
const result = FrequencyAnalysis.analyze('Hello World');

console.log('H 的频率:', result.letters['H']);
console.log('He 的频率:', result.bigrams['He']);
console.log('Hel 的频率:', result.trigrams['Hel']);
console.log('重合指数:', result.ic);
console.log('卡方值:', result.chiSquared);
```

### 判断语言类型
```javascript
FrequencyAnalysis.detectLanguage(text: string): {
    likely: string,
    scores: { [language: string]: number }
}
```
**返回值：**
| 字段 | 类型 | 说明 |
|------|------|------|
| likely | string | 最可能的语言 (english/chinese/nonsense) |
| scores | object | 各语言评分 |

**示例：**
```javascript
const lang = FrequencyAnalysis.detectLanguage('The quick brown fox');
console.log('最可能语言:', lang.likely);
// 'english'

const lang2 = FrequencyAnalysis.detectLanguage('Xyzw qnop rstu');
console.log('最可能语言:', lang2.likely);
// 'nonsense'
```

### 判断是否为明文
```javascript
FrequencyAnalysis.isReadable(text: string, threshold?: number): boolean
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| text | string | 要检测的文本 |
| threshold | number | 判定阈值 (默认 0.06) |

**示例：**
```javascript
FrequencyAnalysis.isReadable('The quick brown fox');
// true

FrequencyAnalysis.isReadable('Xyzw qnop rstu');
// false
```

### 破解凯撒密码
```javascript
FrequencyAnalysis.caesarBrute(text: string): {
    shift: number,
    decrypted: string,
    score: number
}[]
```
**描述：** 分析所有 25 种移位，返回最可能的解密结果（按评分排序）。

**示例：**
```javascript
const results = FrequencyAnalysis.caesarBrute('Khoor Zruog');
// [
//   { shift: 3, decrypted: 'Hello World', score: 0.95 },
//   { shift: 10, decrypted: 'Vybqb Bqyxb', score: 0.12 },
//   ...
// ]

console.log('最佳移位:', results[0].shift);
// 3
console.log('解密结果:', results[0].decrypted);
// 'Hello World'
```

### Vigenere 密钥长度分析
```javascript
FrequencyAnalysis.vigenereKeyLength(text: string): number[]
```
**描述：** 基于重合指数分析可能的密钥长度。

**示例：**
```javascript
const lengths = FrequencyAnalysis.vigenereKeyLength('DLHY SBMRA...');
console.log('可能的密钥长度:', lengths);
// [5, 10, 15, ...]
```

### Vigenere 密钥破解
```javascript
FrequencyAnalysis.vigenereKey(text: string, keyLength: number): string
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| text | string | 加密文本 |
| keyLength | number | 密钥长度 |

**示例：**
```javascript
const key = FrequencyAnalysis.vigenereKey('Ciphertext', 5);
console.log('破解的密钥:', key);
// 'KEYKE'
```

### 全自动 Vigenere 破解
```javascript
FrequencyAnalysis.vigenereCrack(text: string): {
    key: string,
    decrypted: string
}
```
**描述：** 自动分析密钥长度并破解 Vigenere 密码。

**示例：**
```javascript
const result = FrequencyAnalysis.vigenereCrack('RIJVS UYVJN...');
console.log('密钥:', result.key);
// 'KEY'
console.log('明文:', result.decrypted);
// 'HELLOWORLD'
```

### 最佳 XOR 密钥猜测
```javascript
FrequencyAnalysis.bestXORKey(input: string | Buffer, keyLength?: number): {
    key: number | Buffer,
    result: string,
    score: number
}[]
```
**描述：** 基于字符频率分析找出最可能的 XOR 密钥。

**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string \| Buffer | 加密的输入 |
| keyLength | number | 密钥长度 (默认 1) |

**示例：**
```javascript
const encrypted = encode.XOR('Hello World', 0x42);
const best = FrequencyAnalysis.bestXORKey(encrypted, 1);

console.log('最佳密钥:', best[0].key);
// 66 (0x42)
console.log('解密结果:', best[0].result);
// 'Hello World'
console.log('评分:', best[0].score);
// 0.95
```

---

## 字典生成器 (新增)

根据各种模式生成密码字典。

### 键盘模式生成
```javascript
DictionaryGenerator.keyboardPatterns(base: string, depth: number): string[]
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| base | string | 基础字符串 (如 'qwerty') |
| depth | number | 递归深度 |

**示例：**
```javascript
DictionaryGenerator.keyboardPatterns('qwerty', 2);
// ['qwerty', 'qwer', 'qwe', 'qw', 'q', 'erty', 'rty', 'ty', 'y', ...]

DictionaryGenerator.keyboardPatterns('asdf', 3);
// 更多组合...
```

### 日期模式生成
```javascript
DictionaryGenerator.datePatterns(startYear: number, endYear: number, formats?: string[]): string[]
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| startYear | number | 起始年份 |
| endYear | number | 结束年份 |
| formats | string[] | 日期格式数组 (可选) |

**默认格式：**
- `yyyyMMdd`
- `yyyy-MM-dd`
- `yyyy/MM/dd`
- `ddMMyyyy`
- `MMddyyyy`
- `yyyyMM`
- `MMyyyy`

**示例：**
```javascript
DictionaryGenerator.datePatterns(2020, 2025);
// ['20200101', '2020-01-01', '2020/01/01', '01012020', ...]

DictionaryGenerator.datePatterns(2000, 2005, ['yyyy', 'yy']);
// ['2000', '2001', '2002', '2003', '2004', '2005', '00', '01', '02', '03', '04', '05']
```

### 组合字典
```javascript
DictionaryGenerator.combine(words1: string[], words2: string[], separator?: string): string[]
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| words1 | string[] | 第一组单词 |
| words2 | string[] | 第二组单词 |
| separator | string | 连接符 (默认 '') |

**示例：**
```javascript
DictionaryGenerator.combine(['password', 'admin'], ['123', '!@#']);
// ['password123', 'password!@#', 'admin123', 'admin!@#']

DictionaryGenerator.combine(['password'], ['!', '@', '#'], '_');
// ['password_!', 'password_@', 'password_#']
```

### 变形字典
```javascript
DictionaryGenerator.mutate(word: string, options?: {
    leet?: boolean,
    capitalize?: boolean,
    append?: string[],
    prepend?: string[]
}): string[]
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| word | string | 基础单词 |
| options | object | 变形选项 |
| options.leet | boolean | 是否进行 1337 替换 (默认 true) |
| options.capitalize | boolean | 是否首字母大写 (默认 true) |
| options.append | string[] | 追加的后缀 |
| options.prepend | string[] | 添加的前缀 |

**示例：**
```javascript
DictionaryGenerator.mutate('password');
// ['password', 'Password', 'p@ssword', 'P@ssword', ...]

DictionaryGenerator.mutate('admin', { append: ['123', '!'], prepend: ['#', '@'] });
// ['admin', 'Admin', 'admin123', 'admin!', '#admin', '#admin123', ...]
```

### 完整字典生成
```javascript
DictionaryGenerator.generate(options: {
    baseWords?: string[],
    years?: number[],
    depth?: number,
    leet?: boolean
}): string[]
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| baseWords | string[] | 基础单词列表 |
| years | number[] | 年份范围 |
| depth | number | 键盘模式深度 |
| leet | boolean | 是否包含 1337 替换 |

**示例：**
```javascript
DictionaryGenerator.generate({
    baseWords: ['password', 'admin'],
    years: [2020, 2025],
    depth: 1,
    leet: true
});
// ['password', 'Password', 'p@ssword', '2020', 'password2020', ...]
```

---

## LSB 隐写提取 (新增)

从图片中提取最低有效位隐写的数据。

### 提取 LSB 数据
```javascript
LSBExtract.extract(filePath: string, bitCount?: number, mode?: string): string
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| filePath | string | 图片文件路径 |
| bitCount | number | 每像素提取的位数 (默认 1) |
| mode | string | 模式：'LSB' 或 'MSB' (默认 'LSB') |

**返回值：** 提取的二进制字符串

**示例：**
```javascript
// 提取最低 1 位
const binary1 = LSBExtract.extract('stego.png', 1, 'LSB');
console.log('提取的二进制:', binary1);

// 提取最低 2 位
const binary2 = LSBExtract.extract('stego.png', 2, 'LSB');

// 提取为 ASCII
const ascii = LSBExtract.extract('stego.png', 1, 'LSB');
const text = ascii.match(/.{8}/g).map(b => String.fromCharCode(parseInt(b, 2))).join('');
console.log('提取的文本:', text);
```

### 提取并转换为 ASCII 文本
```javascript
LSBExtract.extractText(filePath: string, bitCount?: number, mode?: string): string
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| filePath | string | 图片文件路径 |
| bitCount | number | 每像素提取的位数 (默认 1) |
| mode | string | 模式：'LSB' 或 'MSB' (默认 'LSB') |

**示例：**
```javascript
const text = LSBExtract.extractText('stego.png', 1, 'LSB');
console.log('提取的文本:', text);
// 'Hello CTF!'
```

### 提取并保存为文件
```javascript
LSBExtract.extractToFile(filePath: string, outputPath: string, bitCount?: number, mode?: string): void
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| filePath | string | 源图片路径 |
| outputPath | string | 输出文件路径 |
| bitCount | number | 每像素提取的位数 (默认 1) |
| mode | string | 模式 (默认 'LSB') |

**示例：**
```javascript
LSBExtract.extractToFile('stego.png', 'output.bin', 1, 'LSB');
console.log('数据已保存到 output.bin');
```

### 批量提取（平面图像）
```javascript
LSBExtract.extractPlane(filePath: string, plane: number, width: number, height: number): string
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| filePath | string | 图片文件路径 |
| plane | number | 颜色平面 (0=R, 1=G, 2=B) |
| width | number | 图像宽度 |
| height | number | 图像高度 |

**示例：**
```javascript
// 提取红色平面的 LSB
const redLSB = LSBExtract.extractPlane('stego.png', 0, 640, 480);
console.log('红色平面 LSB:', redLSB);
```

---

## PNG 文件检查 (新增)

分析 PNG 文件结构，检测隐写痕迹。

### 检查 PNG 文件
```javascript
PNGCheck.check(filePath: string): {
    isPNG: boolean,
    hasAncillaryChunks: boolean,
    chunks: string[],
    hasStego: boolean,
    details: string[]
}
```
**返回值：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isPNG | boolean | 是否为有效 PNG |
| hasAncillaryChunks | boolean | 是否包含辅助块 |
| chunks | string[] | 所有块类型列表 |
| hasStego | boolean | 是否可能包含隐写 |
| details | string[] | 详细信息 |

**示例：**
```javascript
const result = PNGCheck.check('image.png');

console.log('是有效 PNG:', result.isPNG);
console.log('包含辅助块:', result.hasAncillaryChunks);
console.log('块列表:', result.chunks);
console.log('可能包含隐写:', result.hasStego);
```

### 检测 PNG 隐写
```javascript
PNGCheck.detectStego(filePath: string): {
    hasStego: boolean,
    stegoType: string,
    confidence: number,
    details: string[]
}
```
**返回值：**
| 字段 | 类型 | 说明 |
|------|------|------|
| hasStego | boolean | 是否检测到隐写 |
| stegoType | string | 可能的隐写类型 |
| confidence | number | 检测置信度 (0-1) |
| details | string[] | 详细信息 |

**示例：**
```javascript
const result = PNGCheck.detectStego('stego.png');

if (result.hasStego) {
    console.log('检测到隐写类型:', result.stegoType);
    console.log('置信度:', result.confidence);
    console.log('详情:', result.details);
}
```

### 获取 PNG 详细信息
```javascript
PNGCheck.getInfo(filePath: string): {
    width: number,
    height: number,
    bitDepth: number,
    colorType: number,
    compression: string,
    filter: string,
    interlace: string,
    chunkCount: number
}
```
**示例：**
```javascript
const info = PNGCheck.getInfo('image.png');
console.log('尺寸:', info.width, 'x', info.height);
console.log('位深度:', info.bitDepth);
console.log('颜色类型:', info.colorType);
console.log('压缩:', info.compression);
```

---

## ZIP 文件分析 (新增)

分析 ZIP 文件结构，检测伪加密。

### 分析 ZIP 文件
```javascript
ZIPInfo.analyze(filePath: string): {
    hasPseudoEncryption: boolean,
    compressionMethod: number,
    encryptionFlag: number,
    files: {
        name: string,
        compressedSize: number,
        uncompressedSize: number
    }[],
    details: string[]
}
```
**返回值：**
| 字段 | 类型 | 说明 |
|------|------|------|
| hasPseudoEncryption | boolean | 是否检测到伪加密 |
| compressionMethod | number | 压缩方法 |
| encryptionFlag | number | 加密标志 |
| files | array | 文件列表 |
| details | string[] | 详细信息 |

**示例：**
```javascript
const result = ZIPInfo.analyze('archive.zip');

console.log('有伪加密:', result.hasPseudoEncryption);
console.log('加密标志:', result.encryptionFlag);
console.log('文件列表:');
result.files.forEach(f => {
    console.log(`  - ${f.name}: ${f.compressedSize} -> ${f.uncompressedSize} bytes`);
});
```

### 检测伪加密
```javascript
ZIPInfo.detectPseudoEncryption(filePath: string): {
    hasPseudoEncryption: boolean,
    details: string[]
}
```
**描述：** 专门检测 ZIP 文件的伪加密（修改全局加密位 9 字节）。

**示例：**
```javascript
const result = ZIPInfo.detectPseudoEncryption('archive.zip');

if (result.hasPseudoEncryption) {
    console.log('检测到伪加密!');
    console.log('详情:', result.details);
    
    // 修复伪加密
    ZIPInfo.fixPseudoEncryption(filePath, 'fixed.zip');
}
```

### 修复伪加密
```javascript
ZIPInfo.fixPseudoEncryption(filePath: string, outputPath: string): void
```
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| filePath | string | 源 ZIP 文件路径 |
| outputPath | string | 输出文件路径 |

**示例：**
```javascript
// 检测并修复伪加密
const result = ZIPInfo.detectPseudoEncryption('secret.zip');
if (result.hasPseudoEncryption) {
    ZIPInfo.fixPseudoEncryption('secret.zip', 'fixed.zip');
    console.log('伪加密已修复，保存为 fixed.zip');
}
```

### 提取文件信息
```javascript
ZIPInfo.extractInfo(filePath: string): {
    fileCount: number,
    totalSize: number,
    compressionMethods: number[],
    comments: string
}
```
**示例：**
```javascript
const info = ZIPInfo.extractInfo('archive.zip');
console.log('文件数量:', info.fileCount);
console.log('总大小:', info.totalSize);
console.log('压缩方法:', info.compressionMethods);
```

### 暴力破解 ZIP 密码
```javascript
ZIPInfo.bruteForce(filePath: string, dictionary: string[]): string | null
```
**描述：** 使用字典暴力破解 ZIP 密码（仅标准加密，不支持 AES）。

**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| filePath | string | ZIP 文件路径 |
| dictionary | string[] | 密码字典 |

**返回值：** 找到的密码，未找到返回 null

**示例：**
```javascript
const passwords = ['123456', 'password', 'admin', '12345'];
const found = ZIPInfo.bruteForce('locked.zip', passwords);

if (found) {
    console.log('密码是:', found);
} else {
    console.log('未找到密码');
}
```

---

*最后更新: 2025-02-12*

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

#### 18. Playfair 解码
```javascript
decode.Playfair(input: string, key: string): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string | 要解码的文本 |
| key | string | 解密密钥 |

**描述：** 使用 5x5 密钥矩阵进行双字母解密 (自动处理插入的 X)。

**示例：**
```javascript
decode.Playfair('DBNVMI', 'KEY');  // 'HELLO'
decode.Playfair('ZMQMGV', 'KEY');  // 'WORLD'
```

#### 19. Affine 解码
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

#### 26. DangPu 解码
```javascript
decode.DangPu(str: string): string
```
**DangPu 字典：**
| 字符 | 数字 | 字符 | 数字 |
|------|------|------|------|
| 口、田 | 0 | 人、工 | 3、4 |
| 由、中 | 1、2 | 大、王、夫、井、羊 | 5、6、7、8、9 |

**示例：**
```javascript
decode.DangPu('由大工');  // '124'
decode.DangPu('王夫井');  // '678'
```

#### 27. ZaHuoPu 解码
```javascript
decode.ZaHuoPu(str: string): string
```
**当铺贷字典：**
| 字符 | 数字 | 字符 | 数字 |
|------|------|------|------|
| 丁不勾、示不小 | 1、2 | 皂不白、分不刀 | 7、8 |
| 王不立、罪不非 | 3、4 | 馗不首、针不金 | 9、0 |
| 吾不口、交不叉 | 5、6 | | |

**备用字典：**
| 字符 | 数字 | 字符 | 数字 |
|------|------|------|------|
| 平头、空工 | 1、2 | 皂底、分头 | 7、8 |
| 横川、侧目 | 3、4 | 未丸、田心 | 9、0 |
| 缺丑、断大 | 5、6 | | |

**示例：**
```javascript
decode.ZaHuoPu('由工王');  // '124'
decode.ZaHuoPu('兔子兔子乌龟兔子');  // 数字字符串
```

#### 28. YuFoLunChan 解码
```javascript
decode.YuFoLunChan(str: string): string
```
**描述：** 佛语轮禅编码是一种基于梵文字符的加密编码，结合 AES-256-CBC 加密。

**特征：** 字符串末尾包含 5 个以上的梵文字符。

**示例：**
```javascript
decode.YuFoLunChan('内容由加密');  // 解密后的明文
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
**参数：**
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
encode.Unicode('Hello', 1);  // '\u0048\u0065\u006c\u006c\u006f'
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

#### 23. DangPu 编码
```javascript
encode.DangPu(str: string): string
```
**描述：** 将数字转换为汉字的编码方式。

**示例：**
```javascript
encode.DangPu('124');  // '由大工'
encode.DangPu('678');  // '大王井'
```

#### 24. Polybius 坐标编码
```javascript
encode.Polybius(str: string, customAlphabet?: string): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| str | string | 要编码的文本 |
| customAlphabet | string | 自定义字母表 (可选) |

**描述：** 将字母转换为 5x5 坐标表示 (I 和 J 共享 24 位置)。

**示例：**
```javascript
encode.Polybius('HELLO');  // '23 15 32 32 35'
encode.Polybius('WORLD');  // '53 35 43 32 14'
```

#### 25. Playfair 密码编码
```javascript
encode.Playfair(str: string, key: string): string
```
| 参数 | 类型 | 说明 |
|------|------|------|
| str | string | 要编码的文本 |
| key | string | 密钥 |

**描述：** 使用 5x5 密钥矩阵进行双字母加密 (I 和 J 共享位置)。

**示例：**
```javascript
encode.Playfair('HELLO', 'KEY');  // 'DBNVMI'
encode.Playfair('WORLD', 'KEY');  // 'ZMQMGV'
```

#### 26. XOR 加密
```javascript
XOR(input: string | Buffer, key: number | Buffer): string | Buffer
```
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string \| Buffer | 要加密的文本或缓冲区 |
| key | number \| Buffer | 单字节密钥或密钥缓冲区 |

**描述：** 对输入进行 XOR 加密/解密。

**示例：**
```javascript
XOR('Hello', 0x42);              // XOR加密
XOR(Buffer.from([1,2,3]), 0xFF); // XOR加密缓冲区
XOR(result, 0x42);               // 再次XOR解密
```

#### 26. XOR 爆破
```javascript
bruteXOR(input: string | Buffer, keyLength?: number): { key: Buffer; result: string }[]
```
| 参数 | 类型 | 说明 |
|------|------|------|
| input | string \| Buffer | 要破解的密文 |
| keyLength | number | 密钥长度 (默认 1) |

**描述：** 遍历所有可能的密钥，找出可读的结果。

**示例：**
```javascript
bruteXOR('密文', 1);  // 单字节爆破，返回所有可读结果
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


