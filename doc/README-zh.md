# CTF-UTILS

一个基于 Node.js 的 CTF 工具包，用于使用各种加密和编码方法检测、解码和编码消息。

## 功能

- **60+ 编码/加密方法** - 全面支持古典密码、现代编码和隐写术工具
- **TypeScript 支持** - 包含完整的类型定义
- **双重异步/同步 API** - 选择异步（Promise）或同步方法
- **CTFUtils 类** - 用于编码/解码操作的链式 API
- **CLI 工具** - 用于快速操作的命令行界面
- **文件分析工具** - LSB 隐写术、PNG 结构分析、ZIP 伪加密检测
- **RSA 求解器** - 高级 RSA 密码学工具，支持密钥生成、加密/解密和常见攻击
- **取证工具** - 文件分析和隐写术检测工具
- **漏洞利用工具** - 二进制漏洞利用工具
- **数学工具** - 高级密码学数学函数
- **结构清晰的文档** - 明确的文档职责划分

## 文档结构

项目文档按以下文件组织：

- **README.md** - 项目概述、安装和快速入门指南
- **doc/README-zh.md** - README 的中文版本
- **doc/CryptoTypes.md** - 加密类型和编码方法的详细文档
- **doc/CryptoTypes-zh.md** - CryptoTypes 文档的中文版本
- **doc/Solver.md** - 求解器模块（RSA、取证、漏洞利用、数学）文档
- **doc/Solver-zh.md** - Solver 文档的中文版本

## 安装

### 作为包

```bash
npm install ctf-utils
# 或
pnpm add ctf-utils
```

```javascript
const ctfUtils = require("ctf-utils");
```

### 作为 CLI

```bash
npm install -g ctf-utils
ctf-utils detect '636A56355279427363446C4A49454A71545342'
```

## 快速开始

### 直接 API

```javascript
const { detect, decode, encode, CTFUtils } = require("ctf-utils");

// 检测编码类型
detect.Brainfuck("++[>+<-]");     // true

// 解码 (异步)
await decode.Base85("NM&qn0001Q"); // "Hello"

// 编码 (异步)
await encode.Base64("hello");      // "aGVsbG8="

// 同步版本可用
decodeSync.Base64("aGVsbG8=");    // "hello"
encodeSync.Base64("hello");       // "aGVsbG8="
```

### CTFUtils 类 (链式 API)

```javascript
const { CTFUtils } = require("ctf-utils");

// 异步模式
const result1 = await new CTFUtils("Hello", "KEY")
    .encode.Base64()
    .val();
console.log(result1); // "SGVsbG8="

// 同步模式
const result2 = new CTFUtils("Hello", "KEY")
    .encodeSync.Base64()
    .val();
console.log(result2); // "SGVsbG8="

// 使用密钥
await new CTFUtils("HELLO")
    .encode.ADFGVX("KEY")
    .val(); // "DDGAXDFAGF"
```

## CLI 使用

```bash
# 检测编码类型
ctf-utils detect <输入>

# 编码
ctf-utils encode <方法> <输入> [-k, --key <密钥>]

# 解码
ctf-utils decode <方法> <输入> [-k, --key <密钥>]
```

### CLI 示例

```bash
# 检测 Brainfuck
ctf-utils detect "++[>+<-]>"
# 输出: Brainfuck       Poem

# Base85 编码
ctf-utils encode Base85 "Hello"
# 输出: [Base85] Hello => NM&qn0001Q

# 使用密钥的 ADFGVX 编码
ctf-utils encode ADFGVX "HELLO" -k "KEY"
# 输出: [ADFGVX] HELLO => DDGAXDFAGF

# 使用密钥的 ADFGVX 解码
ctf-utils decode ADFGVX "DDGAXDFAGF" -k "KEY"
# 输出: [ADFGVX] DDGAXDFAGF => HVALW
```

## 支持的方法

### 古典密码

| 密码 | 检测 | 解码 | 编码 | 描述 |
|------|------|------|------|------|
| Caesar | | ✅ | ✅ | 可配置移位的移位密码 |
| ROT5/13/47 | | ✅ | ✅ | 旋转密码 |
| Vigenere | ✅ | ✅ | ✅ | 多表替换密码 |
| Playfair | ✅ | ✅ | ✅ | 多字母替换密码 |
| Affine | ✅ | ✅ | ✅ | 线性替换密码 |
| RailFence | ✅ | ✅ | ✅ | 转置密码 |
| Atbash | ✅ | ✅ | ✅ | 字母反转密码 |
| SimpleSub | ✅ | ✅ | ✅ | 简单替换密码 |
| ADFGVX | ✅ | ✅ | ✅ | 分馏密码 |
| Polybius | ✅ | ✅ | ✅ | 平方坐标密码 |

### 现代编码

| 编码 | 检测 | 解码 | 编码 | 描述 |
|------|------|------|------|------|
| Base64 | ✅ | ✅ | ✅ | RFC 4648 Base64 |
| Base32 | ✅ | ✅ | ✅ | RFC 4648 Base32 |
| Base16 | ✅ | ✅ | ✅ | 十六进制 |
| Base58 | ✅ | ✅ | ✅ | 比特币地址编码 |
| Base62 | ✅ | ✅ | ✅ | 紧凑编码 |
| Base85 | ✅ | ✅ | ✅ | Ascii85/高密度 |
| Base91 | ✅ | ✅ | ✅ | 高效编码 |
| HEX | ✅ | ✅ | ✅ | 十六进制字符串 |
| OCT | ✅ | ✅ | ✅ | 八进制字符串 |
| Decimal | ✅ | ✅ | ✅ | 十进制 ASCII |
| BinStr | ✅ | ✅ | ✅ | 二进制字符串 |
| URL | ✅ | ✅ | ✅ | URL 编码 |
| HTML | ✅ | ✅ | ✅ | HTML 实体 |
| Unicode | ✅ | ✅ | ✅ | Unicode 转义序列 |
| JQ | ✅ | ✅ | ✅ | Jothello's Quotes 编码 |
| Pinyin | ✅ | ✅ | ✅ | 中文拼音编码 |
| Wubi | ✅ | ✅ | ✅ | 中文五笔编码 |

### Brainfuck/Ook! 系列

| 语言 | 检测 | 解码 | 编码 | 描述 |
|------|------|------|------|------|
| Brainfuck | ✅ | ✅ | ✅ | Brainfuck 语言 |
| Ook! | ✅ | ✅ | ✅ | Ook! 语言变体 |

### 中文密码

| 密码 | 检测 | 解码 | 编码 | 描述 |
|------|------|------|------|------|
| Morse | ✅ | ✅ | ✅ | 摩尔斯电码 |
| DangPu | ✅ | ✅ | ✅ | 当铺密码 |
| ZaHuoPu | ✅ | ✅ | ✅ | 座右铭密码 |
| Poem | ✅ | ✅ | ✅ | 藏头诗 |
| YuFoLunChan | ✅ | ✅ | ✅ | 与佛论禅 |
| Exponential | ✅ | ✅ | ✅ | 指数密码 |

### 密码哈希

| 哈希 | 检测 | 编码 | 描述 |
|------|------|------|------|
| MD5 | ✅ | ✅ | MD5 哈希 (32 位十六进制) |

### 实用函数

| 函数 | 检测 | 描述 |
|------|------|------|
| XOR | ✅ | XOR 加密/暴力破解 |
| FrequencyAnalysis | | 字符频率分析 |
| DictionaryGenerator | | 密码字典生成 |
| AES/DES | | AES-128/192/256 和 DES 加密 |

### RSA 求解器

RSA 求解器提供了全面的 RSA 密码学挑战工具，包括密钥生成、加密/解密和常见攻击。

#### RSA 功能

- **密钥生成** - 生成具有可配置位长度的 RSA 密钥对
- **加密/解密** - 基本 RSA 加密和解密，带 CRT 优化
- **常见攻击** - 各种 RSA 攻击方法的实现
- **实用函数** - 素数检测、密钥强度评估等

#### RSA 使用示例

```javascript
const { solver } = require("ctf-utils");

// 生成 RSA 密钥对
const keyPair = await solver.RSA.RSASolver.generateKeyPair(512);
console.log(keyPair.publicKey);
console.log(keyPair.privateKey);

// 加密和解密消息
const message = "Hello, RSA!";
const encrypted = solver.RSA.RSASolver.encrypt(message, keyPair.publicKey);
const decrypted = solver.RSA.RSASolver.decrypt(encrypted, keyPair.privateKey);
console.log(decrypted); // "Hello, RSA!"

// 评估密钥强度
const strength = solver.RSA.RSASolver.evaluateKeyStrength(keyPair.publicKey.n);
console.log(strength); // { keySize: 512, strength: "Weak" }

// 运行小指数攻击 (e=3)
const n = 3233n; // 61 * 53
const e = 3n;
const ciphertext = 2790n;
const plaintext = solver.RSA.attacks.smallExponent(ciphertext, { n, e });
console.log(plaintext); // 42n

// 运行 Coppersmith 攻击寻找小根
const polynomial = (x) => x - 42n;
const root = solver.RSA.attacks.coppersmith(n, polynomial, 0.5);
console.log(root); // 42n
```

#### 支持的 RSA 攻击

| 攻击 | 描述 |
|------|------|
| smallExponent | 小指数攻击 (e=3) |
| commonModulus | 使用两个不同指数的共模攻击 |
| wiener | Wiener 小私钥攻击 |
| hastadBroadcast | 使用多个公钥的 Hastad 广播攻击 |
| franklinReiter | Franklin-Reiter 相关消息攻击 |
| bonehDurfee | Boneh-Durfee 小私钥攻击 |
| coppersmith | Coppersmith 多项式小根攻击 |
| coppersmithFactor | Coppersmith 部分信息因式分解攻击 |
| factorKnownPrimes | 使用已知 p 和 q 分解 n |
| privateKeyFromFactors | 从素数因子计算私钥 |
| trialDivision | 小因子试除法 |

### 文件分析工具

| 工具 | 描述 |
|------|------|
| BinaryFile | 通过魔术字节检测文件类型 |
| PNGCheck | PNG 结构分析和隐写术检测 |
| ZIPInfo | ZIP 文件分析和伪加密检测 |
| LSBExtract | 最低有效位隐写术提取 |
| AudioSteganography | 音频文件隐写术分析 |

### 培根密码

| 密码 | 检测 | 解码 | 编码 | 描述 |
|------|------|------|------|------|
| Bacon | ✅ | ✅ | ✅ | 培根密码 (A/B 或 0/1) |

## API 参考

### 直接函数 (默认异步)

```javascript
const { encode, decode, detect } = require("ctf-utils");

// 异步 (基于 Promise)
await encode.Base64("hello");
await decode.Base64("aGVsbG8=");
await detect.Base64("aGVsbG8=");

// 同步版本
const { encodeSync, decodeSync, detectSync } = require("ctf-utils");
encodeSync.Base64("hello");
decodeSync.Base64("aGVsbG8=");
detectSync.Base64("aGVsbG8=");
```

### CTFUtils 类

```javascript
const { CTFUtils } = require("ctf-utils");

// 异步方法
await new CTFUtils("hello")
    .encode.Base64()
    .decode.Base64()
    .val();

// 同步方法
new CTFUtils("hello")
    .encodeSync.Base64()
    .decodeSync.Base64()
    .val();

// 使用密钥的方法
await new CTFUtils("HELLO", "KEY")
    .encode.ADFGVX()
    .val();
```

### 文件分析示例

```javascript
const { BinaryFile, PNGCheck, ZIPInfo, LSBExtract } = require("ctf-utils");
const fs = require("fs");

// 检测文件类型
const pngBuffer = fs.readFileSync("image.png");
const types = BinaryFile.detect(pngBuffer);
console.log(types); // ['png']

// 检查 PNG 结构
const pngInfo = PNGCheck.check("image.png");
console.log(pngInfo);

// 分析 ZIP 伪加密
const zipInfo = ZIPInfo.analyze("file.zip");
console.log(zipInfo.hasPseudoEncryption);

// 提取 LSB 隐藏数据
const hiddenData = LSBExtract.extract("stego.png", 3, "LSB");
console.log(hiddenData);
```

### 频率分析

```javascript
const { FrequencyAnalysis } = require("ctf-utils");

// 分析字符频率
const result = FrequencyAnalysis.analyze("Hello World");
console.log(result.letters['H']); // 'H' 的频率
console.log(result.ic);           // 重合指数

// 找到最佳 XOR 密钥
const xorResults = FrequencyAnalysis.bestXORKey("encrypted data");
console.log(xorResults[0]); // 最可能的密钥和结果
```

### 字典生成

```javascript
const { DictionaryGenerator } = require("ctf-utils");

// 生成键盘模式密码
const patterns = DictionaryGenerator.keyboardPatterns("qwerty", 3);

// 生成基于日期的密码
const dates = DictionaryGenerator.datePatterns(2020, 2025);

// 生成组合字典
const combos = DictionaryGenerator.combine(["password", "123"], ["!", "@"]);
// ['password', '123', 'password!', 'password@', '123!', '123@']
```

## 开发

```bash
# 安装依赖
pnpm install

# 构建 (TypeScript src → lib)
pnpm build

# 运行测试
node test/run-all-tests.js
```

## 文档

有关更详细的文档，请参考以下文件：

- **doc/CryptoTypes.md** - 加密类型和编码方法的详细文档
- **doc/CryptoTypes-zh.md** - CryptoTypes 文档的中文版本
- **doc/Solver.md** - 求解器模块（RSA、取证、漏洞利用、数学）文档
- **doc/Solver-zh.md** - Solver 文档的中文版本
- **README.md** - 此 README 的英文版本

## 警告

`detect` 函数表示**可能性**，而非确定性。阳性结果意味着输入*可能*是该格式。

## 许可证

MIT