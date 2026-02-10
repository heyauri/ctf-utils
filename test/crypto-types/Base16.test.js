const ctf = require('../../lib/index.js');
const { encode, decode, detect } = ctf;

const tests = ["48656c6c6f", "776f726c64", "4354467b746573747d"];

console.log("【Base16 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const decoded = decode.Base16(original);
    const encoded = encode.Base16(decoded);
    const isDetected = detect.Base16(encoded);
    
    console.log(`  Base16: "${original}" -> detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded.length > 0 && encoded === original.toUpperCase()) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);