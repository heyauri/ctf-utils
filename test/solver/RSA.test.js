/**
 * RSA 模块测试
 */

const { RSA } = require('../../lib/solver/index.js');
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

console.log('【测试完成】');
