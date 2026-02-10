const ctf = require('../../lib/index.js');
const { encode, decode, detect } = ctf;

const tests = ["Hello", "你好", "🎉"];

console.log("【Unicode 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const encoded = encode.Unicode(original);
    const decoded = decode.Unicode(encoded);
    const isDetected = detect.Unicode(encoded);
    
    console.log(`  Unicode: "${original}" -> detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded === original && isDetected) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);