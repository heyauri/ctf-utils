/**
 * Cracker 模块测试（经典密码自动破解）
 */

const solver = require('../../lib/solver/index.js');

console.log('【Cracker 模块测试】');
console.log('');

let passed = 0;
let total = 0;
const assert = (name, cond) => {
    total++;
    console.log(`   ${cond ? '✅' : '❌'} ${name}`);
    if (cond) passed++;
};

const C = solver.Analysis.Cracker;
const enc = (pt, k) => pt.split('').map((c, i) =>
    String.fromCharCode(((c.charCodeAt(0) - 65) + (k.charCodeAt(i % k.length) - 65)) % 26 + 65)).join('');

// 1. caesarBrute
console.log('1. 测试 caesarBrute');
try {
    const pt = 'THEUNIONFORCESWILLMARCHATDAWNANDTAKETHEBRIDGEDEFENSESWILLHOLDUNTILREINFORCEMENTSARRIVEFROMTHEEAST';
    const ct = pt.split('').map((c, i) => String.fromCharCode(((c.charCodeAt(0) - 65) + 3) % 26 + 65)).join('');
    const results = C.caesarBrute(ct);
    assert('返回 26 个候选', results.length === 26);
    assert('正确移位排名第一', results[0].shift === 3 && results[0].decrypted === pt);
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 2. vigenereKeyLength
console.log('2. 测试 vigenereKeyLength');
try {
    const pt = 'THEENEMYWILLATTACKATDAWNBRINGALLTHEMENANDPREPARETHECANNONSFORTHEBATTLEAHEADWEWILLDEFENDTHECASTLE';
    const ct = enc(pt, 'FORTRESS');
    const lengths = C.vigenereKeyLength(ct);
    assert('返回候选数组', Array.isArray(lengths) && lengths.length > 0);
    assert('真实密钥长度 8 在前 5 名', lengths.slice(0, 5).some(l => l.length === 8));
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 3. vigenereCrack
console.log('3. 测试 vigenereCrack');
try {
    const cases = [
        ['THEENEMYWILLATTACKATDAWNBRINGALLTHEMENANDPREPARETHECANNONSFORTHEBATTLEAHEADWEWILLDEFENDTHECASTLEWITHOURlIVES'.toUpperCase(), 'FORTRESS'],
        ['MEETMEATTHEOLDWAREHOUSEATMIDNIGHTBRINGTHEMAPSTHEKEYSANDENOUGHMENFORTHEJOBWELEAVEBEFORESUNRISE', 'NIGHTFALL'],
        ['THEHISTORYOFCRYPTOGRAPHYBEGINSTHOUSANDSOFYEARSAGOANCIENTEGYPTIANSUSEDUNUSUALHIEROGLYPHSFORSECRETCOMMUNICATION', 'LONGERKEY'],
        ['ATTACKTHEGATEATDAWNTHENSURRENDER', 'KEY'],
        ['CRYPTOGRAPHYISTHEPRACTICEANDSTUDYOFTECHNIQUESFORSECURECOMMUNICATIONINTHEPRESENCEOFADVERSARIALBEHAVIOR', 'VIGENERE']
    ];
    let exact = 0;
    let bestAccuracy = 1;
    for (const [pt, k] of cases) {
        const r = C.vigenereCrack(enc(pt, k));
        if (r && r.decrypted === pt) { exact++; continue; }
        const acc = r ? [...r.decrypted].filter((c, i) => c === pt[i]).length / pt.length : 0;
        bestAccuracy = Math.min(bestAccuracy, acc);
    }
    assert(`5 例中至少 4 例完全破解（实际 ${exact}）`, exact >= 4);
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 4. bestXORKey
console.log('4. 测试 bestXORKey');
try {
    const xored = 'Hello World'.split('').map(c => c.charCodeAt(0) ^ 0x42);
    const single = C.bestXORKey(xored, 1, 3);
    assert('单字节 XOR 破解 (0x42)', single[0].key[0] === 0x42 && single[0].result === 'Hello World');
    const multi = 'The quick brown fox jumps over'.split('').map((c, i) => c.charCodeAt(0) ^ [0x11, 0x22, 0x33][i % 3]);
    const multiResult = C.bestXORKey(multi, 3, 3);
    assert('多字节 XOR 破解', multiResult[0].result === 'The quick brown fox jumps over');
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
// 5. isReadable
console.log('5. 测试 isReadable');
try {
    assert('英文句子可读', C.isReadable('The quick brown fox jumps over the lazy dog'));
    assert('乱码不可读', !C.isReadable('Xyzw qnop rstu jklm hgfe'));
} catch (error) {
    assert(`无异常: ${error.message}`, false);
}

console.log('');
console.log(`结果: ${passed}/${total} 通过\n`);
process.exit(passed === total ? 0 : 1);
