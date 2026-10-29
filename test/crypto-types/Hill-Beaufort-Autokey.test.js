/**
 * Hill / Beaufort / Autokey 测试
 */

const { encodeSync, decodeSync } = require('../../lib/index.js');

console.log('【Hill / Beaufort / Autokey 测试】');
console.log('');

let passed = 0;
let total = 0;
const assert = (name, cond) => {
    total++;
    console.log(`   ${cond ? '✅' : '❌'} ${name}`);
    if (cond) passed++;
};

// 1. Hill
console.log('1. 测试 Hill 密码');
try {
    assert('经典向量 HELP/DDCF -> HIAT', encodeSync.Hill('HELP', 'DDCF') === 'HIAT');
    assert('经典向量 ACT/GYBNQKURP -> POH', encodeSync.Hill('ACT', 'GYBNQKURP') === 'POH');
    const rt2 = decodeSync.Hill(encodeSync.Hill('Attack at dawn', 'CDFV'), 'CDFV');
    assert('2x2 往返', rt2 === 'ATTACKATDAWN');
    const rt3 = decodeSync.Hill(encodeSync.Hill('Attack at dawn', 'GYBNQKURP'), 'GYBNQKURP');
    assert('3x3 往返', rt3 === 'ATTACKATDAWN');
    let threw = false;
    try { encodeSync.Hill('HI', 'ABCD'); } catch { threw = true; }
    assert('不可逆矩阵抛出错误', threw);
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 2. Beaufort
console.log('2. 测试 Beaufort 密码');
try {
    assert('加密 HELLO/KEY -> DANZQ', encodeSync.Beaufort('HELLO', 'KEY') === 'DANZQ');
    const rt = decodeSync.Beaufort(encodeSync.Beaufort('Attack at dawn!', 'SECRET'), 'SECRET');
    assert('往返（互逆运算）', rt === 'ATTACKATDAWN');
    assert('对密文再加密得到明文', encodeSync.Beaufort(encodeSync.Beaufort('HELLO', 'KEY'), 'KEY') === 'HELLO');
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 3. Autokey
console.log('3. 测试 Autokey 密码');
try {
    assert('加密 HELLO/KEY -> RIJSS', encodeSync.Autokey('HELLO', 'KEY') === 'RIJSS');
    const rt = decodeSync.Autokey(encodeSync.Autokey('Attack at dawn!', 'SECRET'), 'SECRET');
    assert('往返', rt === 'ATTACKATDAWN');
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
console.log(`结果: ${passed}/${total} 通过\n`);
process.exit(passed === total ? 0 : 1);
