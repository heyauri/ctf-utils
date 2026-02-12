const ctf = require('../../lib/index.js');
const { CTFUtils } = ctf;

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

const tests = [
        { value: "HELLO", key: "KEY", expected: "HELLO" },
        { value: "WORLD", key: "KEY", expected: "WORLD" },
        { value: "ATTACK", key: "KEY", expected: "ATTACK" },
        { value: "CTFISFUN", key: "SECRET", expected: "CTFISFUN" },
        { value: "HELLOWORLD", key: "PLAYFAIR", expected: "HELLOWORLD" },
        { value: "TESTCASE", key: "CRYPTO", expected: "TESTCASE" },
        { value: "A", key: "KEY", expected: "A" },
        { value: "HELLOWORLD123", key: "KEY", expected: "HELLOWORLD" },
        { value: "HELLO WORLD", key: "KEY", expected: "HELLOWORLD" }
];

// 同步测试用例
const syncTests = [
        { value: "HELLO", key: "KEY" },
        { value: "WORLD", key: "KEY" },
        { value: "ATTACK", key: "KEY" }
];

async function runTests() {
    console.log("【Playfair 测试】\n");

    let passed = 0;
    let total = tests.length;

    // 异步测试
    for (const { value, key, expected } of tests) {
        const ctf = new CTFUtils(value);

        const encoded = await (await ctf.encode.Playfair(key)).val();
        const isDetected = await ctf.detect.Playfair();
        const decoded = await (await ctf.decode.Playfair(key)).val();

        console.log(`  Playfair: "${value}" detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);

        if (decoded === expected) {
            passed++;
            console.log(`    ✅`);
        } else {
            console.log(`    ❌ 预期: "${expected}"`);
        }
    }

    // 同步测试
    console.log("\n【Playfair 同步测试】\n");
    let syncPassed = 0;
    let syncTotal = syncTests.length;

    for (const { value, key } of syncTests) {
        const ctf = new CTFUtils(value);

        const encoded = ctf.encodeSync.Playfair(key).val();
        const decoded = new CTFUtils(encoded).decodeSync.Playfair(key).val();

        console.log(`  Playfair Sync: "${value}" encode:"${encoded}" -> decode:"${decoded}"`);

        if (decoded === value) {
            syncPassed++;
            console.log(`    ✅`);
        } else {
            console.log(`    ❌`);
        }
    }

    console.log(`\n结果: ${passed}/${total} 通过 (异步) | ${syncPassed}/${syncTotal} 通过 (同步)\n`);
    clearTimeout(timer);
    process.exit((passed === total && syncPassed === syncTotal) ? 0 : 1);
}

runTests().catch(err => {
    console.error('测试错误:', err);
    clearTimeout(timer);
    process.exit(1);
});
