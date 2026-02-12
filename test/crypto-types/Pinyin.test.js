const ctf = require('../../lib/index.js');
const { CTFUtils } = ctf;

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

const tests = [
        { value: "你好" },
        { value: "世界" },
        { value: "中国" },
        { value: "CTF比赛" },
        { value: "Hello 世界 123" },
        { value: "拼音编码测试" },
        { value: "A" },
        { value: "" },
        { value: "1234567890" },
        { value: "!@#$%^&*()" }
];

// 同步测试用例
const syncTests = [
        { value: "你好" },
        { value: "世界" },
        { value: "中国" }
];

async function runTests() {
    console.log("【Pinyin 测试】\n");

    let passed = 0;
    let total = tests.length;

    // 异步测试
    for (const { value } of tests) {
        const ctf = new CTFUtils(value);

        const encoded = await (await ctf.encode.Pinyin()).val();
        const isDetected = await ctf.detect.Pinyin();
        const decoded = await (await ctf.decode.Pinyin()).val();

        console.log(`  Pinyin: "${value}" detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);

        if (decoded === value) {
            passed++;
            console.log(`    ✅`);
        } else {
            console.log(`    ❌`);
        }
    }

    // 同步测试
    console.log("\n【Pinyin 同步测试】\n");
    let syncPassed = 0;
    let syncTotal = syncTests.length;

    for (const { value } of syncTests) {
        const ctf = new CTFUtils(value);

        const encoded = ctf.encodeSync.Pinyin().val();
        const decoded = new CTFUtils(encoded).decodeSync.Pinyin().val();

        console.log(`  Pinyin Sync: "${value}" encode:"${encoded}" -> decode:"${decoded}"`);

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
