const ctf = require('../../lib/index.js');
const { encode, decode } = ctf;

const tests = ["Hello", "World", "CTF"];

console.log("【DangPu 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const encoded = encode.DangPu(original);
    const decoded = decode.DangPu(encoded);
    
    console.log(`  DangPu: "${original}" -> encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded === original) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);