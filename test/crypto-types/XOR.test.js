const XORModule = require('../../lib/crypto-types/XOR.js');

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

const tests = [
    { value: "Hello" },
    { value: "World" },
    { value: "Test123" },
    { value: "CTF{flag}" },
    { value: "P@ssw0rd!" }
];

async function runTests() {
    console.log("【XOR 测试】\n");

    let passed = 0;
    let total = tests.length;

    for (const { value } of tests) {
        const singleXor = XORModule.XOR(value, 0x42);
        const isDetected = XORModule.detect(value);
        const brute = XORModule.bruteXOR(value, 1);

        console.log(`  XOR: "${value}" -> single XOR: "${singleXor.substring(0, 20)}..."`);
        console.log(`    detect: ${isDetected}, brute results: ${brute.length}`);

        if (isDetected && brute.length > 0) {
            passed++;
            console.log(`    ✅`);
        } else {
            console.log(`    ❌`);
        }
    }

    console.log(`\n结果: ${passed}/${total} 通过\n`);
    clearTimeout(timer);
    process.exit(passed === total ? 0 : 1);
}

runTests().catch(err => {
    console.error('测试错误:', err);
    clearTimeout(timer);
    process.exit(1);
});
