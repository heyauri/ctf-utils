const ctf = require('../../lib/index.js');
const { CTFUtils } = ctf;

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

const tests = [
        { value: "hello" },
        { value: "world" },
        { value: "sos" }
];

async function runTests() {
    console.log("【Morse 测试】\n");

    let passed = 0;
    let total = tests.length;

    for (const { value } of tests) {
        const ctf = new CTFUtils(value);

        const encoded = await (await ctf.encode.Morse()).val();
        const isDetected = await ctf.detect.Morse();
        const decoded = await (await ctf.decode.Morse()).val();

        console.log(`  Morse: "${value}" detect:${isDetected} encode:"${encoded}" -> decode:"${decoded}"`);

        if (decoded === value) {
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
