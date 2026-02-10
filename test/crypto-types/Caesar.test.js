const ctf = require('../../lib/index.js');
const { encode, decode } = ctf;

const tests = ["Hello", "World", "CTF{test}"];

console.log("【Caesar 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const shift = 3;
    const encoded = encode.Caesar(original, shift);
    const decoded = decode.Caesar(encoded, shift);
    
    console.log(`  Caesar: "${original}" -> encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded === original) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);