const ctf = require('../../lib/index.js');
const { decode } = ctf;

const tests = ["84", "8426", "8421126"];

console.log("【Exponential 测试】\n");

let passed = 0;
let total = tests.length;

for (const original of tests) {
    const decoded = decode.Exponential(original);
    
    console.log(`  Exponential: "${original}" -> decode:"${decoded}"`);
    
    if (decoded.length > 0 && !decoded.includes('Not Expected Format')) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);