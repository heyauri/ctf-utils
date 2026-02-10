const ctf = require('../../lib/index.js');
const { encode, decode, detect } = ctf;

const tests = ["Hello", "World", "CTF"];

console.log("【OCT 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const encoded = encode.OCT(original);
    const decoded = decode.OCT(encoded);
    const isDetected = detect.OCT(encoded);
    
    console.log(`  OCT: "${original}" -> detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded === original && isDetected) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);