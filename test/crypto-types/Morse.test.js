const ctf = require('../../lib/index.js');
const { encode, decode } = ctf;

const tests = ["HELLO", "WORLD", "TEST"];

console.log("【Morse 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const encoded = encode.Morse(original);
    const decoded = decode.Morse(encoded);
    
    console.log(`  Morse: "${original}" -> encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded.toUpperCase() === original) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);