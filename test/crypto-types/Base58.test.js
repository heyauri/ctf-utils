const ctf = require('../../lib/index.js');
const { encode, decode, detect } = ctf;

const tests = ["123", "Hello", "CTF{test}"];

console.log("【Base58 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const encoded = encode.Base58(original);
    const decoded = decode.Base58(encoded);
    const isDetected = detect.Base58(encoded);
    
    console.log(`  Base58: "${original}" -> detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded === original && isDetected) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);