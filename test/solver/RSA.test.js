/**
 * RSA 模块测试
 */

const solver = require('../../lib/solver/index.js');
const { RSA } = solver.Crypto;
const { attacks } = RSA;

console.log('【RSA 模块测试】');
console.log('');

// 测试 RSA 加密和解密
console.log('1. 测试 RSA 加密和解密');
try {
  // 生成测试密钥对
  const publicKey = { n: 3233n, e: 17n };
  const privateKey = { d: 413n, n: 3233n };
  const message = 65n; // 'A' in ASCII
  
  const ciphertext = RSA.encrypt(message, publicKey);
  const decrypted = RSA.decrypt(ciphertext, privateKey);
  
  console.log(`   原始消息: ${message}`);
  console.log(`   密文: ${ciphertext}`);
  console.log(`   解密结果: ${decrypted}`);
  console.log(`   ${decrypted === message ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试小指数攻击
console.log('2. 测试小指数攻击 (e=3)');
try {
  const publicKey = { n: 3233n, e: 3n };
  const message = 123n;
  const ciphertext = RSA.encrypt(message, publicKey);
  
  const recovered = attacks.smallExponent(ciphertext, publicKey);
  console.log(`   原始消息: ${message}`);
  console.log(`   密文: ${ciphertext}`);
  console.log(`   恢复的消息: ${recovered}`);
  console.log(`   ${recovered === message ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试共模攻击
console.log('3. 测试共模攻击');
try {
  const n = 3233n;
  const e1 = 17n;
  const e2 = 23n;
  const d1 = 413n;
  const message = 65n;
  
  const publicKey1 = { n, e: e1 };
  const publicKey2 = { n, e: e2 };
  const ciphertext1 = RSA.encrypt(message, publicKey1);
  const ciphertext2 = RSA.encrypt(message, publicKey2);
  
  const recovered = attacks.commonModulus(ciphertext1, ciphertext2, publicKey1, publicKey2);
  console.log(`   原始消息: ${message}`);
  console.log(`   密文1: ${ciphertext1}`);
  console.log(`   密文2: ${ciphertext2}`);
  console.log(`   恢复的消息: ${recovered}`);
  console.log(`   ${recovered === message ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试 Franklin-Reiter 攻击
console.log('4. 测试 Franklin-Reiter 攻击');
try {
  const publicKey = { n: 3233n, e: 3n };
  const message = 123n;
  const a = 2n;
  const b = 5n;
  const relatedMessage = (a * message + b) % publicKey.n;
  
  const ciphertext1 = RSA.encrypt(message, publicKey);
  const ciphertext2 = RSA.encrypt(relatedMessage, publicKey);
  
  const recovered = attacks.franklinReiter(ciphertext1, ciphertext2, publicKey, a, b);
  console.log(`   原始消息: ${message}`);
  console.log(`   相关消息: ${relatedMessage}`);
  console.log(`   密文1: ${ciphertext1}`);
  console.log(`   密文2: ${ciphertext2}`);
  console.log(`   恢复的消息: ${recovered}`);
  console.log(`   ${recovered === message ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试因子分解
console.log('5. 测试因子分解');
try {
  const n = 3233n;
  const p = 61n;
  const q = 53n;
  
  const result = attacks.factorKnownPrimes(n, p, q);
  console.log(`   n: ${n}`);
  console.log(`   预期因子: p=${p}, q=${q}`);
  console.log(`   实际因子: p=${result.p}, q=${result.q}`);
  console.log(`   ${result.p * result.q === n ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试从因子生成私钥
console.log('6. 测试从因子生成私钥');
try {
  const p = 61n;
  const q = 53n;
  const e = 17n;
  
  const privateKey = attacks.privateKeyFromFactors(p, q, e);
  const publicKey = { n: p * q, e };
  const message = 65n;
  
  const ciphertext = RSA.encrypt(message, publicKey);
  const decrypted = RSA.decrypt(ciphertext, privateKey);
  
  console.log(`   原始消息: ${message}`);
  console.log(`   解密结果: ${decrypted}`);
  console.log(`   ${decrypted === message ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试 RSA 密钥生成弱点攻击
console.log('7. 测试 RSA 密钥生成弱点攻击');
try {
  const n = 123456789n;
  const publicKey = { n, e: 17n };
  
  const result = attacks.rsaKeygenWeakness(publicKey);
  console.log(`   n: ${n}`);
  console.log(`   因子分解结果: ${result ? `p=${result.p}, q=${result.q}` : '未找到因子'}`);
  console.log(`   ${result && result.p * result.q === n ? '✅' : '⚠️'} 测试完成`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试已知 phi(n) 的因子分解
console.log('8. 测试已知 phi(n) 的因子分解');
try {
  const n = 3233n;
  const phi = 3120n; // (61-1)*(53-1)
  
  const result = attacks.factorWithKnownPhi(n, phi);
  console.log(`   n: ${n}`);
  console.log(`   phi(n): ${phi}`);
  console.log(`   因子分解结果: ${result ? `p=${result.p}, q=${result.q}` : '未找到因子'}`);
  console.log(`   ${result && result.p * result.q === n ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试共素数攻击
console.log('9. 测试共素数攻击');
try {
  const p = 61n;
  const q1 = 53n;
  const q2 = 73n;
  const n1 = p * q1;
  const n2 = p * q2;
  
  const publicKey1 = { n: n1, e: 17n };
  const publicKey2 = { n: n2, e: 23n };
  
  const result = attacks.commonPrimeAttack(publicKey1, publicKey2);
  console.log(`   n1: ${n1}`);
  console.log(`   n2: ${n2}`);
  console.log(`   共素数结果: ${result}`);
  console.log(`   ${result === p ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试 Wiener's 攻击
console.log('10. 测试 Wiener\'s 攻击');
try {
  // 使用小私钥的 RSA 密钥对
  const n = 3337n;
  const e = 17n;
  const d = 2753n;
  const publicKey = { n, e };
  
  const result = attacks.wiener(publicKey);
  console.log(`   n: ${n}`);
  console.log(`   e: ${e}`);
  console.log(`   预期 d: ${d}`);
  console.log(`   恢复的 d: ${result ? result.d : '未找到'}`);
  console.log(`   ${result && result.d === d ? '✅' : '⚠️'} 测试完成`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试 Boneh-Durfee 攻击
console.log('11. 测试 Boneh-Durfee 攻击');
try {
  // 使用小私钥的 RSA 密钥对
  const n = 3337n;
  const e = 17n;
  const publicKey = { n, e };
  
  const result = attacks.bonehDurfee(publicKey);
  console.log(`   n: ${n}`);
  console.log(`   e: ${e}`);
  console.log(`   恢复的私钥: ${result ? `d=${result.d}` : '未找到'}`);
  console.log(`   ${result ? '✅' : '⚠️'} 测试完成`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试 Hastad's broadcast 攻击
console.log('12. 测试 Hastad\'s broadcast 攻击');
try {
  // 使用三个不同的 RSA 密钥对，都使用 e=3
  const publicKey1 = { n: 3233n, e: 3n };
  const publicKey2 = { n: 3337n, e: 3n };
  const publicKey3 = { n: 3557n, e: 3n };
  const message = 123n;
  
  const ciphertext1 = RSA.encrypt(message, publicKey1);
  const ciphertext2 = RSA.encrypt(message, publicKey2);
  const ciphertext3 = RSA.encrypt(message, publicKey3);
  
  const result = attacks.hastadBroadcast([ciphertext1, ciphertext2, ciphertext3], [publicKey1, publicKey2, publicKey3]);
  console.log(`   原始消息: ${message}`);
  console.log(`   恢复的消息: ${result}`);
  console.log(`   ${result === message ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试低指数 CRT 攻击
console.log('13. 测试低指数 CRT 攻击');
try {
  const publicKey = { n: 3233n, e: 3n };
  const message = 123n;
  const ciphertext = RSA.encrypt(message, publicKey);
  
  const result = attacks.lowExponentCRT(ciphertext, publicKey);
  console.log(`   原始消息: ${message}`);
  console.log(`   密文: ${ciphertext}`);
  console.log(`   恢复的消息: ${result}`);
  console.log(`   ${result === message ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试素数幂模数攻击
console.log('14. 测试素数幂模数攻击');
try {
  const p = 11n;
  const k = 3n;
  const n = p ** k;
  const publicKey = { n, e: 17n };
  
  const result = attacks.primePowerModulus(publicKey);
  console.log(`   n: ${n} (${p}^${k})`);
  console.log(`   因子分解结果: ${result ? `p=${result.p}, q=${result.q}` : '未找到因子'}`);
  console.log(`   ${result && result.p === p && result.q === p ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

console.log('【测试完成】');
