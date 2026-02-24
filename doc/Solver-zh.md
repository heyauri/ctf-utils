# Solver 模块文档

## 概述

Solver 模块提供了用于解决 CTF 挑战的高级工具，包括密码学攻击、取证分析、二进制漏洞利用和数学工具。

## 目录
- [密码学模块](#密码学模块)
  - [RSA 子模块](#rsa-子模块)
  - [Hash 子模块](#hash-子模块)
  - [Lattice 子模块](#lattice-子模块)
- [取证模块](#取证模块)
- [漏洞利用模块](#漏洞利用模块)
- [数学模块](#数学模块)
- [Web 模块](#web-模块)
- [逆向工程模块](#逆向工程模块)
- [分析模块](#分析模块)
- [工具模块](#工具模块)

## 密码学模块

密码学模块提供了全面的密码学挑战工具，包括 RSA 密码学、哈希攻击和格密码学攻击。

### RSA 子模块

RSA 子模块提供了用于 RSA 密码学挑战的工具，包括密钥生成、加密/解密和常见攻击。

#### RSA 功能

- **密钥生成** - 生成具有可配置位长度的 RSA 密钥对
- **加密/解密** - 基本 RSA 加密和解密，带有 CRT 优化
- **常见攻击** - 各种 RSA 攻击方法的实现
- **实用函数** - 素数检测、密钥强度评估、GCD、模逆元等

#### RSA 使用示例

```javascript
const { solver } = require("ctf-utils");

// 生成 RSA 密钥对
const keyPair = await solver.Crypto.RSA.generateKeyPair(512);
console.log(keyPair.publicKey);
console.log(keyPair.privateKey);

// 加密和解密消息
const message = "Hello, RSA!";
const encrypted = solver.Crypto.RSA.encrypt(message, keyPair.publicKey);
const decrypted = solver.Crypto.RSA.decrypt(encrypted, keyPair.privateKey);
console.log(decrypted); // "Hello, RSA!"

// 评估密钥强度
const strength = solver.Crypto.RSA.evaluateKeyStrength(keyPair.publicKey.n);
console.log(strength); // { keySize: 512, strength: "Weak" }

// 运行小指数攻击 (e=3)
const n = 3233n; // 61 * 53
const e = 3n;
const ciphertext = 2790n;
const plaintext = solver.Crypto.RSA.attacks.smallExponent(ciphertext, { n, e });
console.log(plaintext); // 42n

// 运行 Coppersmith 小根攻击
const polynomial = (x) => x - 42n;
const root = solver.Crypto.RSA.attacks.coppersmith(n, polynomial, 0.5);
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
| franklinReiterImproved | 改进的 Franklin-Reiter 攻击 |
| bonehDurfee | Boneh-Durfee 小私钥攻击 |
| coppersmith | Coppersmith 多项式小根攻击 |
| coppersmithFactor | Coppersmith 部分信息因式分解攻击 |
| rsaCrtFaultAttack | CRT 错误实现攻击 |
| rsaKeygenWeakness | 密钥生成弱点的利用 |
| lowExponentCRT | 低指数 CRT 攻击 |
| primePowerModulus | 质数幂模数攻击 |
| multiPrimeRSA | 多素数 RSA 分解 |
| factorKnownPrimes | 使用已知 p 和 q 分解 n |
| privateKeyFromFactors | 从素数因子计算私钥 |
| trialDivision | 小因子试除法 |
| factorWithKnownPhi | 已知 φ(n) 的因式分解 |
| rsaCrtImplementationError | CRT 实现错误攻击 |
| lowExponentRelatedMessages | 低指数相关消息攻击 |
| commonPrimeAttack | 共同素数攻击 |
| rsaPrivateKeyFaultInjection | 私钥错误注入攻击 |

### Hash 子模块

Hash 子模块提供了用于哈希分析和攻击的工具，包括哈希生成、破解和碰撞检测。

#### Hash 功能

- **哈希生成** - 使用 MD5、SHA1、SHA256、SHA512 算法生成哈希
- **暴力破解** - 使用可配置字符集的哈希暴力破解
- **字典攻击** - 基于字典的哈希破解
- **彩虹表攻击** - 基于彩虹表的哈希破解
- **哈希碰撞** - 查找哈希碰撞（使用加密安全的随机数）
- **哈希前缀生成** - 生成具有指定前缀的哈希
- **哈希长度扩展** - 执行哈希长度扩展攻击
- **哈希类型分析** - 基于长度和模式分析哈希类型

#### Hash 使用示例

```javascript
const { solver } = require("ctf-utils");

// 生成哈希
const md5Hash = solver.Crypto.Hash.md5("test");
const sha1Hash = solver.Crypto.Hash.sha1("test");
console.log(md5Hash, sha1Hash);

// 暴力破解哈希
const plaintext = "abc";
const hash = solver.Crypto.Hash.md5(plaintext);
const result = solver.Crypto.Hash.bruteForceHash(hash, "abcdefghijklmnopqrstuvwxyz", 3);
console.log(result); // "abc"

// 分析哈希类型
const hashToAnalyze = "5d41402abc4b2a76b9719d911017c592";
const algorithms = solver.Crypto.Hash.analyzeHashType(hashToAnalyze);
console.log(algorithms); // ["MD5"]

// 生成指定前缀的哈希
const prefix = "00";
const input = solver.Crypto.Hash.generateHashWithPrefix(prefix, 2);
const generatedHash = solver.Crypto.Hash.md5(input);
console.log(input, generatedHash);

// 查找哈希碰撞
const collision = solver.Crypto.Hash.findHashCollision("md5", 1000000);
if (collision) {
  console.log(collision.input1, collision.input2, collision.hash);
}
```

### Lattice 子模块

Lattice 子模块提供了用于格密码学攻击的工具，包括 LLL 算法和基于格的 RSA 攻击。

#### Lattice 功能

- **LLL 算法** - 格基约减算法
- **Hastad 广播攻击** - 使用格方法的广播攻击
- **向量的点积** - 计算向量点积
- **向量范数** - 计算向量范数
- **向量运算** - 向量加减、标量乘法
- **Gram-Schmidt 正交化** - 格基的 Gram-Schmidt 正交化
- **短向量搜索** - 在格中寻找短向量
- **整数根计算** - 计算大整数的 n 次根

#### Lattice 使用示例

```javascript
const { solver } = require("ctf-utils");

// 使用 LLL 算法约减格基
const basis = [
  { elements: [1, 0, 0] },
  { elements: [1, 2, 0] },
  { elements: [1, 1, 1] }
];
const result = solver.Crypto.Lattice.LatticeAttacks.lllAlgorithm(basis);
console.log(result.reducedBasis, result.determinant);

// 使用 Hastad 广播攻击
const moduli = [n1, n2, n3]; // 多个 RSA 模数
const ciphertexts = [c1, c2, c3]; // 对应的密文
const e = 3n; // 公共指数
const plaintext = solver.Crypto.Lattice.LatticeAttacks.hastadBroadcastAttack(moduli, ciphertexts, e);
console.log(plaintext);
```

## Web 模块

Web 模块提供了用于分析 HTTP 请求/响应和检测 Web 安全漏洞的工具。

### HTTP 子模块

HTTP 子模块提供了用于解析和分析 HTTP 请求和响应的工具。

#### HTTP 功能

- **请求解析** - 将 HTTP 请求解析为结构化对象
- **响应解析** - 将 HTTP 响应解析为结构化对象
- **安全分析** - 分析 HTTP 消息中的安全问题
- **请求/响应生成** - 从结构化数据生成 HTTP 消息

#### HTTP 使用示例

```javascript
const { solver } = require("ctf-utils");

// 解析 HTTP 请求
const requestString = 'GET /api/users HTTP/1.1\r\nHost: example.com\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\n\r\n';
const request = solver.Web.HTTP.HTTPAnalyzer.parseRequest(requestString);
console.log(request.method, request.path, request.headers);

// 解析 HTTP 响应
const responseString = 'HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: 13\r\n\r\n{"status":"ok"}';
const response = solver.Web.HTTP.HTTPAnalyzer.parseResponse(responseString);
console.log(response.statusCode, response.statusMessage, response.body);

// 分析请求安全
const securityIssues = solver.Web.HTTP.HTTPAnalyzer.analyzeRequestSecurity(request);
console.log(securityIssues);
```

### Security 子模块

Security 子模块提供了用于分析 Web 安全问题的工具，包括 JWT 令牌、CSRF 令牌和 XSS 漏洞。

#### Security 功能

- **JWT 分析** - 解析和验证 JWT 令牌
- **CSRF 令牌分析** - 分析 CSRF 令牌安全性
- **XSS 有效载荷生成** - 生成 XSS 测试有效载荷
- **XSS 检测** - 检测 HTML 中的 XSS 漏洞
- **会话管理分析** - 分析会话 cookie 安全性
- **SQL 注入检测** - 检测 SQL 注入模式

#### Security 使用示例

```javascript
const { solver } = require("ctf-utils");

// 解析 JWT 令牌
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJleHAiOjk5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const jwt = solver.Web.Security.WebSecurity.parseJWT(token);
console.log(jwt.header, jwt.payload);

// 验证 JWT 令牌
const secret = 'secret';
const isValid = solver.Web.Security.WebSecurity.verifyJWT(token, secret);
console.log(isValid);

// 生成 XSS 有效载荷
const xssType = 'stored';
const payloads = solver.Web.Security.WebSecurity.generateXSSPayloads(xssType);
console.log(payloads);
```

## 逆向工程模块

逆向工程模块提供了用于分析二进制文件和控制流图的工具。

### 逆向工程功能

- **控制流分析** - 分析二进制文件的控制流图
- **二进制反汇编** - 将二进制代码反汇编为汇编指令
- **函数识别** - 识别二进制文件中的函数
- **调用图生成** - 为二进制文件生成调用图
- **字符串分析** - 从二进制文件中提取和分析字符串
- **符号分析** - 分析二进制文件中的导入/导出符号
- **二进制结构分析** - 分析二进制文件结构 (ELF, PE)
- **安全分析** - 分析二进制文件的安全特性 (canary, PIE, NX)
- **漏洞分析** - 检测二进制文件中的潜在漏洞

### 逆向工程使用示例

```javascript
const { solver } = require("ctf-utils");

// 分析控制流图
const cflow = solver.ReverseEngineering.BinaryAnalysis.analyzeControlFlow('program');
console.log(cflow.functions);

// 反汇编二进制代码
const instructions = solver.ReverseEngineering.BinaryAnalysis.disassembleBinary('program', '0x08048000', '0x08048100');
console.log(instructions);

// 分析二进制结构
const structure = solver.ReverseEngineering.BinaryAnalysis.analyzeBinaryStructure('program');
console.log(structure.format, structure.architecture, structure.sections);
```

## 分析模块

分析模块提供了用于密码分析和频率分析的工具。

### 分析功能

- **频率分析** - 分析密文中的字符频率
- **密码分析工具** - 用于破解经典密码的工具

### 分析使用示例

```javascript
const { solver } = require("ctf-utils");

// 频率分析
const ciphertext = 'GUR DHVPX OEBJA QBT WHZCRQ BIRE GUR YNML SBK.';
const analysis = solver.Analysis.FrequencyAnalysis.analyze(ciphertext);
console.log(analysis);

// 英语字母频率比较
const englishFreq = solver.Analysis.FrequencyAnalysis.englishFrequencies;
console.log(englishFreq);
```

## 工具模块

工具模块提供了用于 CTF 挑战的实用函数，包括字典生成。

### 工具功能

- **字典生成** - 生成用于暴力破解的字典
- **通用工具** - 各种用于 CTF 挑战的实用函数

### 工具使用示例

```javascript
const { solver } = require("ctf-utils");

// 生成字典
const charset = 'abcdefghijklmnopqrstuvwxyz';
const minLength = 1;
const maxLength = 3;
const dictionary = solver.Utils.DictionaryGenerator.generate(charset, minLength, maxLength);
console.log(dictionary);
```

## 取证模块

取证模块提供了用于分析文件、提取隐藏数据和检测隐写术的工具。

### 取证功能

- **文件类型检测** - 基于魔术字节识别文件类型
- **PNG 分析** - 分析 PNG 结构并检测隐写术
- **ZIP 分析** - 检测 ZIP 文件中的伪加密
- **LSB 提取** - 使用最低有效位隐写术从图像中提取隐藏数据
- **内存取证** - 分析内存转储并提取信息
- **网络流量分析** - 分析 PCAP 文件和网络流量模式
- **音频隐写术** - 音频文件隐写术分析

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

- **数论** - 最大公约数(GCD)、最小公倍数(LCM)、扩展欧几里得算法、模逆元、欧拉函数、莫比乌斯函数、原根
- **线性代数** - 矩阵运算、行列式、逆矩阵
- **组合数学** - 排列、组合、子集、二项式系数
- **密码学数学** - 素数测试(Miller-Rabin)、模幂运算、离散对数
- **因式分解** - Pollard's Rho 算法、试除法
- **中国剩余定理** - CRT 求解线性同余方程组
- **二次剩余** - 二次同余方程求解（Tonelli-Shanks 算法）

### 数学使用示例

```javascript
const { solver } = require("ctf-utils");

// 数论
const gcd = solver.Math.gcd(12345n, 67890n);
const lcm = solver.Math.lcm(12345n, 67890n);
const modInverse = solver.Math.modInverse(3n, 26n);
const extendedGcd = solver.Math.extendedGcd(35n, 15n);
const phi = solver.Math.eulerTotient(12n);
const isPrime = solver.Math.isPrime(999999937n);

// 线性代数
const matrix = [[1, 2], [3, 4]];
const determinant = solver.Math.matrixDeterminant(matrix);
const inverse = solver.Math.matrixInverse(matrix);
const product = solver.Math.matrixMultiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]);

// 组合数学
const combinations = solver.Math.generateCombinations([1, 2, 3, 4], 2);
const permutations = solver.Math.generatePermutations([1, 2, 3]);
const subsets = solver.Math.generateSubsets([1, 2, 3]);
const binom = solver.Math.binomialCoefficient(10, 3);

// 密码学数学
const modularExp = solver.Math.modPow(2n, 10n, 1000n);
const discreteLog = solver.Math.discreteLogarithm(2n, 8n, 11n);
const primitiveRoot = solver.Math.findPrimitiveRoot(11n);

// 因式分解
const factors = solver.Math.pollardsRho(123456789n);
console.log(factors);

// 中国剩余定理
const congruences = [[2n, 3n], [3n, 5n], [2n, 7n]];
const result = solver.Math.solveCRT(congruences);
console.log(result); // 23n

// 二次同余求解
const solutions = solver.Math.solveQuadraticCongruence(3n, 11n);
console.log(solutions);
```
