const ctf = require('../../lib/index.js');
const { encode, decode, detect } = ctf;

const tests = ["Hello", "World", "CTF{test}"];

console.log("【Base64 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const encoded = encode.Base64(original);
    const decoded = decode.Base64(encoded);
    const isDetected = detect.Base64(encoded);
    
    console.log(`  Base64: "${original}" -> detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded === original && isDetected) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);