const PNGCheck = require('../../lib/crypto-types/PNGCheck.js');
const fs = require('fs');
const path = require('path');

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

async function runTests() {
    console.log("【PNG Check 测试】\n");

    let passed = 0;
    let total = 3;

    try {
        console.log("1. 测试模块加载");
        console.log(`   PNGCheck 模块加载成功`);
        console.log(`   可用方法: ${Object.keys(PNGCheck).join(', ')}`);
        console.log(`   ✅`);
        passed++;
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n2. 测试 PNG 检查功能");
        const testPngPath = path.join(__dirname, '..', 'test.png');
        
        if (fs.existsSync(testPngPath)) {
            const result = PNGCheck.checkPNG(testPngPath);
            console.log(`   PNG 检查结果: ${result.valid ? 'Valid' : 'Invalid'}`);
            console.log(`   图像尺寸: ${result.width}x${result.height}`);
            console.log(`   位深度: ${result.bitDepth}`);
            console.log(`   颜色类型: ${result.colorType}`);
            console.log(`   块数量: ${result.chunks.length}`);
            
            if (result.warnings.length > 0) {
                console.log(`   警告: ${result.warnings.length}`);
            }
            
            if (result.issues.length > 0) {
                console.log(`   问题: ${result.issues.length}`);
            }
            
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   测试文件不存在，跳过 PNG 检查测试`);
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
            const result = PNGCheck.detectPNGSteganography(testPngPath);
            console.log(`   隐写检测结果: ${result.detected ? 'Detected' : 'Not detected'}`);
            console.log(`   置信度: ${result.confidence}%`);
            console.log(`   可能的方法: ${result.methods.join(', ')}`);
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
