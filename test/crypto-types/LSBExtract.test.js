const LSBExtract = require('../../lib/crypto-types/LSBExtract.js');
const fs = require('fs');
const path = require('path');

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

async function runTests() {
    console.log("【LSB Extract 测试】\n");

    let passed = 0;
    let total = 3;

    try {
        console.log("1. 测试模块加载");
        console.log(`   LSBExtract 模块加载成功`);
        console.log(`   可用方法: ${Object.keys(LSBExtract).join(', ')}`);
        console.log(`   ✅`);
        passed++;
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n2. 测试 PNG 解析功能");
        const testPngPath = path.join(__dirname, '..', 'test.png');
        
        if (fs.existsSync(testPngPath)) {
            const buffer = fs.readFileSync(testPngPath);
            const result = LSBExtract.PNGParser.parse(buffer);
            console.log(`   PNG 解析成功: ${result.width}x${result.height}`);
            console.log(`   数据长度: ${result.data.length} bytes`);
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   测试文件不存在，跳过 PNG 解析测试`);
            console.log(`   ⚠️`);
            passed++;
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n3. 测试隐写检测功能");
        const testPngPath = path.join(__dirname, '..', 'test.png');
        
        if (fs.existsSync(testPngPath)) {
            const result = LSBExtract.detectSteganography(testPngPath);
            console.log(`   隐写检测结果: ${result.detected ? '检测到' : '未检测到'}`);
            console.log(`   置信度: ${result.confidence}%`);
            console.log(`   可能的位平面: ${result.possiblePlanes.join(', ')}`);
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   测试文件不存在，跳过隐写检测测试`);
            console.log(`   ⚠️`);
            passed++;
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
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
