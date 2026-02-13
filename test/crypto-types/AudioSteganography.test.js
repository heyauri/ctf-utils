const ctf = require('../../lib/index.js');
const { CTFUtils, solver } = ctf;
const { AudioSteganography } = solver.Forensics;

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

async function runTests() {
    console.log("【AudioSteganography 测试】\n");

    let passed = 0;
    let total = 3;

    // 测试1: 检查API是否存在
    console.log(`  测试1: 检查API是否存在`);
    if (AudioSteganography && typeof AudioSteganography.getInfo === 'function' && typeof AudioSteganography.detect === 'function') {
        passed++;
        console.log(`    ✅ API存在`);
    } else {
        console.log(`    ❌ API不存在`);
    }

    // 测试2: 测试getInfo函数（模拟文件）
    console.log(`  测试2: 测试getInfo函数`);
    try {
        const info = AudioSteganography.getInfo('test.mp3');
        if (info || info === null) {
            passed++;
            console.log(`    ✅ getInfo函数正常`);
        } else {
            console.log(`    ❌ getInfo函数异常`);
        }
    } catch (error) {
        console.log(`    ❌ getInfo函数错误: ${error.message}`);
    }

    // 测试3: 测试detect函数（模拟文件）
    console.log(`  测试3: 测试detect函数`);
    try {
        const result = AudioSteganography.detect('test.mp3');
        if (result && typeof result.hasStego === 'boolean') {
            passed++;
            console.log(`    ✅ detect函数正常`);
        } else {
            console.log(`    ❌ detect函数异常`);
        }
    } catch (error) {
        console.log(`    ❌ detect函数错误: ${error.message}`);
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
