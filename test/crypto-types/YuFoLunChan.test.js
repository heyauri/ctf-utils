const ctf = require('../../lib/index.js');
const { decode } = ctf;

const tests = ["Hello", "World", "CTF"];

console.log("【YuFoLunChan 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const decoded = decode.YuFoLunChan(original);
    
    console.log(`  YuFoLunChan: "${original}" -> decode:"${decoded}"`);
    
    if (decoded.length > 0) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);