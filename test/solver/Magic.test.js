/**
 * Magic 模块测试（自动解码器）
 */

const solver = require('../../lib/solver/index.js');

console.log('【Magic 模块测试】');
console.log('');

let passed = 0;
let total = 0;
const assert = (name, cond) => {
    total++;
    console.log(`   ${cond ? '✅' : '❌'} ${name}`);
    if (cond) passed++;
};

const M = solver.Magic;

// 1. 简单 HEX/Base16
console.log('1. 测试单层解码 (HEX)');
try {
    const results = M.autoDecode('48656c6c6f');
    assert('找到 "Hello" 结果', results.some(r => r.result === 'Hello'));
    assert('结果按分数排序', results.length === 0 || results[0].score >= (results[1] ? results[1].score : 0));
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 2. 嵌套编码: base64(hex('flag{test}'))
console.log('2. 测试嵌套解码 (Base64 -> Base16 -> flag)');
try {
    const nested = Buffer.from(Buffer.from('flag{test}').toString('hex')).toString('base64');
    const results = M.autoDecode(nested);
    const best = results.find(r => r.result === 'flag{test}');
    assert('解出 "flag{test}"', !!best);
    assert('解码路径为 Base64->Base16', !!best && best.path.join('->') === 'Base64->Base16');
    assert('flag 结果排名第一', results[0] && results[0].result === 'flag{test}');
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 3. ROT13
console.log('3. 测试 ROT13');
try {
    const results = M.autoDecode('Uryyb Jbeyq');
    assert('找到 "Hello World" (ROT13)', results.some(r => r.result === 'Hello World' && r.path[0] === 'ROT'));
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 4. Morse
console.log('4. 测试 Morse');
try {
    const results = M.autoDecode('.... . .-.. .-.. ---');
    assert('解出 "hello"', results.some(r => r.result === 'hello'));
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 5. 带密钥的 Vigenere
console.log('5. 测试带密钥解码 (Vigenere)');
try {
    const results = M.autoDecode('Rijvs uyvjn', { key: 'key' });
    assert('用密钥解出 "Hello world" (Vigenere)', results.some(r => r.result === 'Hello world' && r.path[0].startsWith('Vigenere')));
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 6. 明文输入不崩溃且无结果污染
console.log('6. 测试普通明文输入');
try {
    const results = M.autoDecode('just a plain sentence');
    assert('返回数组', Array.isArray(results));
    assert('不包含 "Not Expected Format" 垃圾结果', results.every(r => !r.result.includes('Not Expected Format')));
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 7. detectAll
console.log('7. 测试 detectAll');
try {
    const detected = M.detectAll('48656c6c6f');
    assert('识别出 Base16/HEX', detected.includes('Base16') && detected.includes('HEX'));
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
console.log(`结果: ${passed}/${total} 通过\n`);
process.exit(passed === total ? 0 : 1);
