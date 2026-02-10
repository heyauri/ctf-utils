const ctf = require('../../lib/index.js');
const { encode, decode } = ctf;

const tests = ["HELLO", "WORLD", "CTF{TEST}"];

console.log("【Vigenere 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const key = "KEY";
    const encoded = encode.Vigenere(original, key);
    const decoded = decode.Vigenere(encoded, key);
    
    console.log(`  Vigenere: "${original}" -> encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded === original) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);