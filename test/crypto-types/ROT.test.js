const ctf = require('../../lib/index.js');
const { encode, decode } = ctf;

const tests = ["HELLO", "WORLD", "TEST123"];

console.log("【ROT 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const encoded = encode.ROT(original);
    const decoded = decode.ROT(encoded);
    
    console.log(`  ROT: "${original}" -> encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded === original) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);