const ctf = require('../../lib/index.js');
const { encode, decode, detect } = ctf;

const tests = ["Hello World", "test@example.com", "a=b&c=d"];

console.log("【URL 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const encoded = encode.URL(original);
    const decoded = decode.URL(encoded);
    const isDetected = detect.URL(encoded);
    
    console.log(`  URL: "${original}" -> detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded === original && isDetected) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);