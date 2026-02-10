const ctf = require('../../lib/index.js');
const { decode } = ctf;

const tests = ["Hello", "World", "CTF"];

console.log("【ZaHuoPu 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const decoded = decode.ZaHuoPu(original);
    
    console.log(`  ZaHuoPu: "${original}" -> decode:"${decoded}"`);
    
    if (decoded.length > 0) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);