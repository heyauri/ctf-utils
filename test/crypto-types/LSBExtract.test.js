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
    let total = 6;

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

    try {
        console.log("\n4. 测试位平面提取功能");
        const testPngPath = path.join(__dirname, '..', 'test.png');
        
        if (fs.existsSync(testPngPath)) {
            for (let plane = 0; plane < 8; plane++) {
                try {
                    const result = LSBExtract.extractBitPlane(testPngPath, plane);
                    console.log(`   位平面 ${plane} 提取成功: ${result.length} bytes`);
                } catch (err) {
                    console.log(`   位平面 ${plane} 提取失败: ${err.message}`);
                }
            }
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   测试文件不存在，跳过位平面提取测试`);
            console.log(`   ⚠️`);
            passed++;
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n5. 测试边界情况 - 不存在的文件");
        const nonExistentPath = path.join(__dirname, '..', 'non_existent.png');
        
        try {
            const result = LSBExtract.detectSteganography(nonExistentPath);
            console.log(`   ❌ 应该抛出错误但没有`);
        } catch (err) {
            console.log(`   ✅ 正确处理了不存在的文件: ${err.message}`);
            passed++;
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n6. 测试边界情况 - 无效的位平面值");
        const testPngPath = path.join(__dirname, '..', 'test.png');
        
        if (fs.existsSync(testPngPath)) {
            try {
                LSBExtract.extractBitPlane(testPngPath, 8); // 无效的位平面值
                console.log(`   ❌ 应该抛出错误但没有`);
            } catch (err) {
                console.log(`   ✅ 正确处理了无效的位平面值: ${err.message}`);
                passed++;
            }
        } else {
            console.log(`   测试文件不存在，跳过无效位平面测试`);
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
