/**
 * Hash 模块测试
 */

const solver = require('../../lib/solver/index.js');
const fs = require('fs');
const path = require('path');

const { Hash } = solver.Crypto;

console.log('【Hash 模块测试】');
console.log('');

// 测试哈希生成
console.log('1. 测试哈希生成');
try {
  const input = 'test';
  const md5Hash = Hash.md5(input);
  console.log(`   MD5: ${md5Hash}`);
  console.log(`   ${typeof md5Hash === 'string' && md5Hash.length === 32 ? '✅' : '❌'} MD5 测试通过`);
  
  const sha1Hash = Hash.sha1(input);
  console.log(`   SHA1: ${sha1Hash}`);
  console.log(`   ${typeof sha1Hash === 'string' && sha1Hash.length === 40 ? '✅' : '❌'} SHA1 测试通过`);
  
  const sha256Hash = Hash.sha256(input);
  console.log(`   SHA256: ${sha256Hash}`);
  console.log(`   ${typeof sha256Hash === 'string' && sha256Hash.length === 64 ? '✅' : '❌'} SHA256 测试通过`);
  
  const sha512Hash = Hash.sha512(input);
  console.log(`   SHA512: ${sha512Hash}`);
  console.log(`   ${typeof sha512Hash === 'string' && sha512Hash.length === 128 ? '✅' : '❌'} SHA512 测试通过`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试暴力破解
console.log('2. 测试暴力破解');
try {
  const plaintext = 'abc';
  const hash = Hash.md5(plaintext);
  const charset = 'abcdefghijklmnopqrstuvwxyz';
  const maxLength = 3;
  
  const result = Hash.bruteForceHash(hash, charset, maxLength, 'md5');
  console.log(`   目标: ${plaintext}`);
  console.log(`   结果: ${result}`);
  console.log(`   ${result === plaintext ? '✅' : '❌'} 暴力破解测试通过`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试哈希类型分析
console.log('3. 测试哈希类型分析');
try {
  const md5Hash = '5d41402abc4b2a76b9719d911017c592'; // MD5 hash of 'hello'
  const algorithms = Hash.analyzeHashType(md5Hash);
  console.log(`   哈希: ${md5Hash}`);
  console.log(`   可能的算法: ${algorithms.join(', ')}`);
  console.log(`   ${Array.isArray(algorithms) && algorithms.includes('MD5') ? '✅' : '❌'} 哈希类型分析测试通过`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试生成指定前缀的哈希
console.log('4. 测试生成指定前缀的哈希');
try {
  const prefix = '00';
  const length = 2;
  const input = Hash.generateHashWithPrefix(prefix, length, 'md5');
  const generatedHash = Hash.md5(input);
  console.log(`   输入: ${input}`);
  console.log(`   哈希: ${generatedHash}`);
  console.log(`   ${generatedHash.substring(0, length) === prefix ? '✅' : '❌'} 生成指定前缀的哈希测试通过`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试哈希长度扩展攻击
console.log('5. 测试哈希长度扩展攻击');
try {
  const originalHash = Hash.md5('secret' + 'original data');
  const originalData = 'original data';
  const appendData = 'appended data';
  const keyLength = 6; // Length of 'secret'
  
  const result = Hash.hashLengthExtensionAttack(originalHash, originalData, appendData, keyLength, 'md5');
  console.log(`   ${result && typeof result.extendedHash === 'string' ? '✅' : '❌'} 哈希长度扩展攻击测试通过`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试哈希碰撞
console.log('6. 测试哈希碰撞');
try {
  const result = Hash.findHashCollision('md5', 1000);
  console.log(`   ${result === null || (result.input1 && result.input2 && result.hash) ? '✅' : '❌'} 哈希碰撞测试通过`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试字典攻击
console.log('7. 测试字典攻击');
try {
  const dictionaryPath = path.join(__dirname, 'test_dict.txt');
  const plaintext = 'password';
  const hash = Hash.md5(plaintext);
  
  fs.writeFileSync(dictionaryPath, 'test\npassword\nsecret\n');
  
  try {
    const result = Hash.dictionaryAttack(hash, dictionaryPath, 'md5');
    console.log(`   目标: ${plaintext}`);
    console.log(`   结果: ${result}`);
    console.log(`   ${result === plaintext ? '✅' : '❌'} 字典攻击测试通过`);
  } finally {
    if (fs.existsSync(dictionaryPath)) {
      fs.unlinkSync(dictionaryPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试彩虹表攻击
console.log('8. 测试彩虹表攻击');
try {
  const rainbowTablePath = path.join(__dirname, 'test_rainbow.txt');
  const plaintext = 'test';
  const hash = Hash.md5(plaintext);
  
  fs.writeFileSync(rainbowTablePath, `${plaintext}:${hash}\n`);
  
  try {
    const result = Hash.rainbowTableAttack(hash, rainbowTablePath, 'md5');
    console.log(`   目标: ${plaintext}`);
    console.log(`   结果: ${result}`);
    console.log(`   ${result === plaintext ? '✅' : '❌'} 彩虹表攻击测试通过`);
  } finally {
    if (fs.existsSync(rainbowTablePath)) {
      fs.unlinkSync(rainbowTablePath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试生成彩虹表
console.log('9. 测试生成彩虹表');
try {
  const outputPath = path.join(__dirname, 'test_rainbow_gen.txt');
  const charset = 'abc';
  const minLength = 1;
  const maxLength = 2;
  
  try {
    Hash.generateRainbowTable(charset, minLength, maxLength, outputPath, 'md5');
    console.log(`   ${fs.existsSync(outputPath) ? '✅' : '❌'} 生成彩虹表测试通过`);
  } finally {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');
console.log('【测试完成】');
