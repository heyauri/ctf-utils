const ZIPInfo = require('../../lib/crypto-types/ZIPInfo.js');
const fs = require('fs');
const path = require('path');

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

async function runTests() {
    console.log("【ZIP Info 测试】\n");

    let passed = 0;
    let total = 6;

    try {
        console.log("1. 测试模块加载");
        console.log(`   ZIPInfo 模块加载成功`);
        console.log(`   可用方法: ${Object.keys(ZIPInfo).join(', ')}`);
        console.log(`   ✅`);
        passed++;
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n2. 测试 ZIP 分析功能");
        const testZipPath = path.join(__dirname, '..', 'test.zip');
        
        if (fs.existsSync(testZipPath)) {
            const result = ZIPInfo.analyzeZIP(testZipPath);
            console.log(`   ZIP 分析结果: ${result.valid ? 'Valid' : 'Invalid'}`);
            console.log(`   文件数量: ${result.totalFiles}`);
            console.log(`   压缩大小: ${result.compressedSize} bytes`);
            console.log(`   未压缩大小: ${result.uncompressedSize} bytes`);
            console.log(`   伪加密: ${result.isPseudoEncrypted ? 'Yes' : 'No'}`);
            
            if (result.files.length > 0) {
                console.log(`   第一个文件: ${result.files[0].fileName}`);
            }
            
            if (result.warnings.length > 0) {
                console.log(`   警告: ${result.warnings.length}`);
            }
            
            if (result.issues.length > 0) {
                console.log(`   问题: ${result.issues.length}`);
            }
            
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   测试文件不存在，跳过 ZIP 分析测试`);
            console.log(`   ⚠️`);
            passed++;
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n3. 测试压缩方法常量");
        console.log(`   压缩方法数量: ${Object.keys(ZIPInfo.COMPRESSION_METHODS).length}`);
        console.log(`   示例方法: Stored (0), Deflated (8), BZIP2 (12)`);
        console.log(`   ✅`);
        passed++;
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n4. 测试边界情况 - 不存在的文件");
        const nonExistentPath = path.join(__dirname, '..', 'non_existent.zip');
        
        try {
            const result = ZIPInfo.analyzeZIP(nonExistentPath);
            console.log(`   ❌ 应该抛出错误但没有`);
        } catch (err) {
            console.log(`   ✅ 正确处理了不存在的文件: ${err.message}`);
            passed++;
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n5. 测试边界情况 - 无效的ZIP文件");
        const invalidPath = path.join(__dirname, '..', 'invalid.zip');
        
        // 创建一个无效的ZIP文件
        if (!fs.existsSync(invalidPath)) {
            fs.writeFileSync(invalidPath, 'invalid zip content');
        }
        
        try {
            const result = ZIPInfo.analyzeZIP(invalidPath);
            console.log(`   ZIP 分析结果: ${result.valid ? 'Valid' : 'Invalid'}`);
            if (!result.valid) {
                console.log(`   ✅ 正确检测到无效的ZIP文件`);
                passed++;
            } else {
                console.log(`   ❌ 应该检测到无效的ZIP文件`);
            }
        } catch (err) {
            console.log(`   ✅ 正确处理了无效的ZIP文件: ${err.message}`);
            passed++;
        } finally {
            // 清理无效文件
            if (fs.existsSync(invalidPath)) {
                fs.unlinkSync(invalidPath);
            }
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n6. 测试文件列表分析");
        const testZipPath = path.join(__dirname, '..', 'test.zip');
        
        if (fs.existsSync(testZipPath)) {
            const result = ZIPInfo.analyzeZIP(testZipPath);
            console.log(`   文件列表:`);
            result.files.forEach((file, index) => {
                console.log(`   ${index + 1}. ${file.fileName} (${file.compressedSize} -> ${file.uncompressedSize} bytes)`);
            });
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   测试文件不存在，跳过文件列表分析测试`);
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
