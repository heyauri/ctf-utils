# Solver 模块文档

## 概述

Solver 模块提供了用于解决 CTF 挑战的高级工具，包括密码学攻击、取证分析、二进制漏洞利用和数学工具。

## 目录
- [RSA 模块](#rsa-模块)
- [取证模块](#取证模块)
- [漏洞利用模块](#漏洞利用模块)
- [数学模块](#数学模块)

## RSA 模块

RSA 模块提供了全面的 RSA 密码学挑战工具，包括密钥生成、加密/解密和常见攻击。

### RSA 功能

- **密钥生成** - 生成具有可配置位长度的 RSA 密钥对
- **加密/解密** - 基本 RSA 加密和解密，带有 CRT 优化
- **常见攻击** - 各种 RSA 攻击方法的实现
- **实用函数** - 素数检测、密钥强度评估等

### RSA 使用示例

```javascript
const { solver } = require("ctf-utils");

// 生成 RSA 密钥对
const keyPair = await solver.RSA.generateKeyPair(512);
console.log(keyPair.publicKey);
console.log(keyPair.privateKey);

// 加密和解密消息
const message = "Hello, RSA!";
const encrypted = solver.RSA.encrypt(message, keyPair.publicKey);
const decrypted = solver.RSA.decrypt(encrypted, keyPair.privateKey);
console.log(decrypted); // "Hello, RSA!"

// 评估密钥强度
const strength = solver.RSA.evaluateKeyStrength(keyPair.publicKey.n);
console.log(strength); // { keySize: 512, strength: "Weak" }

// 运行小指数攻击 (e=3)
const n = 3233n; // 61 * 53
const e = 3n;
const ciphertext = 2790n;
const plaintext = solver.RSA.attacks.smallExponent(ciphertext, { n, e });
console.log(plaintext); // 42n

// 运行 Coppersmith 小根攻击
const polynomial = (x) => x - 42n;
const root = solver.RSA.attacks.coppersmith(n, polynomial, 0.5);
console.log(root); // 42n
```

### 支持的 RSA 攻击

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

## 取证模块

取证模块提供了用于分析文件、提取隐藏数据和检测隐写术的工具。

### 取证功能

- **文件类型检测** - 基于魔术字节识别文件类型
- **PNG 分析** - 分析 PNG 结构并检测隐写术
- **ZIP 分析** - 检测 ZIP 文件中的伪加密
- **LSB 提取** - 使用最低有效位隐写术从图像中提取隐藏数据
- **内存取证** - 分析内存转储并提取信息
- **网络流量分析** - 分析 PCAP 文件和网络流量模式

### 取证使用示例

```javascript
const { solver } = require("ctf-utils");
const fs = require("fs");

// 文件类型检测
const pngBuffer = fs.readFileSync("image.png");
const types = solver.Forensics.BinaryFile.detect(pngBuffer);
console.log(types); // ['png']

// PNG 结构分析
const pngInfo = solver.Forensics.PNGCheck.check("image.png");
console.log(pngInfo);

// ZIP 伪加密检测
const zipInfo = solver.Forensics.ZIPInfo.analyze("file.zip");
console.log(zipInfo.hasPseudoEncryption);

// LSB 隐写术提取
const hiddenData = solver.Forensics.LSBExtract.extract("stego.png", 1, "LSB");
console.log(hiddenData);

// 内存取证
const memoryDump = fs.readFileSync("memory.dmp");
const memoryInfo = solver.Forensics.MemoryForensics.analyze(memoryDump);
console.log(memoryInfo);

// 网络流量分析
const pcapData = fs.readFileSync("traffic.pcap");
const networkInfo = solver.Forensics.NetworkTraffic.analyze(pcapData);
console.log(networkInfo);
```

## 漏洞利用模块

漏洞利用模块提供了用于二进制漏洞利用的工具，包括 ROP 链生成、缓冲区溢出工具和 shellcode 生成。

### 漏洞利用功能

- **ROP 链生成** - 生成面向返回的编程链
- **缓冲区溢出工具** - 计算偏移量并生成有效载荷
- **Shellcode 生成** - 为各种架构生成 shellcode
- **格式字符串漏洞利用** - 分析和利用格式字符串漏洞
- **堆漏洞利用** - 堆溢出和使用后释放漏洞的工具
- **二进制结构分析** - 分析 ELF、PE 和 Mach-O 二进制文件

### 漏洞利用使用示例

```javascript
const { solver } = require("ctf-utils");

// ROP 链生成
const ropChain = solver.Exploitation.ROP.generateChain([
  { address: 0xdeadbeef, args: [0x1234, 0x5678] },
  { address: 0xcafebabe, args: [0x9abc] }
]);
console.log(ropChain);

// 缓冲区溢出偏移量计算
const pattern = solver.Exploitation.BufferOverflow.generatePattern(200);
// 用模式使程序崩溃后
const offset = solver.Exploitation.BufferOverflow.findOffset("0x41424344");
console.log("缓冲区溢出偏移量:", offset);

// Shellcode 生成
const shellcode = solver.Exploitation.Shellcode.generate("x86", "linux", "execve");
console.log(shellcode);

// 格式字符串漏洞分析
const formatStringInfo = solver.Exploitation.FormatString.analyze("%x.%x.%x");
console.log(formatStringInfo);

// 二进制结构分析
const binaryInfo = solver.Exploitation.BinaryFile.analyze("program");
console.log(binaryInfo);
```

## 数学模块

数学模块提供了用于解决 CTF 挑战的高级数学工具，包括数论、线性代数、组合数学和密码学数学。

### 数学功能

- **数论** - 最大公约数、最小公倍数、扩展欧几里得算法、模逆元等
- **线性代数** - 矩阵运算、行列式、逆矩阵
- **组合数学** - 排列、组合、子集
- **密码学数学** - 素数测试、模幂运算、离散对数
- **因式分解** - Pollard's Rho 算法、试除法

### 数学使用示例

```javascript
const { solver } = require("ctf-utils");

// 数论
const gcd = solver.Math.gcd(12345n, 67890n);
const lcm = solver.Math.lcm(12345n, 67890n);
const modInverse = solver.Math.modInverse(3n, 26n);

// 线性代数
const matrix = [[1, 2], [3, 4]];
const determinant = solver.Math.matrixDeterminant(matrix);
const inverse = solver.Math.matrixInverse(matrix);

// 组合数学
const combinations = solver.Math.generateCombinations([1, 2, 3, 4], 2);
const permutations = solver.Math.generatePermutations([1, 2, 3]);

// 密码学数学
const isPrime = solver.Math.isPrime(999999937n);
const modularExp = solver.Math.modularExponentiation(2n, 10n, 1000n);

// 因式分解
const factors = solver.Math.pollardsRho(123456789n);
console.log(factors);
```