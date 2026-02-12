const ctf = require('../../lib/index.js');
const { CTFUtils } = ctf;

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

const tests = [
        { value: "HELLO" },
        { value: "WORLD" },
        { value: "CTF" },
        { value: "CTF{JQEncodingIsFun}" },
        { value: "Hello World 123" },
        { value: "A" },
        { value: "" },
        { value: "1234567890" },
        { value: "!@#$%^&*()" },
        { value: "中文测试" }
];

// 同步测试用例
const syncTests = [
        { value: "HELLO" },
        { value: "WORLD" },
        { value: "CTF" }
];

async function runTests() {
    console.log("【JQ 测试】\n");

    let passed = 0;
    let total = tests.length;

    // 异步测试
    for (const { value } of tests) {
        const ctf = new CTFUtils(value);

        const encoded = await (await ctf.encode.JQ()).val();
        const isDetected = await ctf.detect.JQ();
        const decoded = await (await ctf.decode.JQ()).val();

        console.log(`  JQ: "${value}" detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);

        if (decoded === value) {
            passed++;
            console.log(`    ✅`);
        } else {
            console.log(`    ❌`);
        }
    }

    // 同步测试
    console.log("\n【JQ 同步测试】\n");
    let syncPassed = 0;
    let syncTotal = syncTests.length;

    for (const { value } of syncTests) {
        const ctf = new CTFUtils(value);

        const encoded = ctf.encodeSync.JQ().val();
        const decoded = new CTFUtils(encoded).decodeSync.JQ().val();

        console.log(`  JQ Sync: "${value}" encode:"${encoded}" -> decode:"${decoded}"`);

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
