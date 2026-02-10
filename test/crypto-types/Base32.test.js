const ctf = require('../../lib/index.js');
const { encode, decode, detect } = ctf;

const tests = ["JBSWY3DPEHPK3PXP", "NB2WXC3ZFO6WSCQ=", "MFZXC4DANB2W64TMMQXG===="];

console.log("【Base32 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const decoded = decode.Base32(original);
    const encoded = encode.Base32(decoded);
    const isDetected = detect.Base32(encoded);
    
    console.log(`  Base32: "${original}" -> detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);
    
    if (decoded.length > 0) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);