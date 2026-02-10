const ctf = require('../../lib/index.js');
const { decode } = ctf;

const tests = [
    { poem: "床前明月光疑是地上霜", target: "举起望明月", msg: ["1", "3", "5", "7"] },
    { poem: "春眠不觉晓处处闻啼鸟", target: "夜来风雨声", msg: ["1", "3", "5", "7"] },
    { poem: "白日依山尽黄河入海流", target: "欲穷千里目", msg: ["1", "3", "5", "7"] }
];

console.log("【Poem 测试】\n");

let passed = 0;
let total = tests.length;

for (const { poem, target, msg } of tests) {
    try {
        const decoded = decode.Poem(target, poem, msg);
        
        console.log(`  Poem: target="${target}" -> decode:"${decoded}"`);
        
        if (decoded && decoded.length > 0) {
            passed++;
            console.log(`    ✅`);
        } else {
            console.log(`    ❌`);
        }
    } catch (e) {
        console.log(`  Poem: 错误 - ${e.message}`);
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);