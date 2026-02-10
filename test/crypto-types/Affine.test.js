const ctf = require('../../lib/index.js');
const { encode, decode } = ctf;

const tests = ["HELLO", "WORLD", "CTF{TEST}"];

console.log("【Affine 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const params = { a: 5, b: 8 };
    const encoded = encode.Affine(original, params);
    const decoded = decode.Affine(encoded, params);
    
    console.log(`  Affine: "${original}" -> encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded === original) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);