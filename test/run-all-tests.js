const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 测试目录
const testDirs = [
    path.join(__dirname, 'crypto-types'),
    path.join(__dirname, 'solver'),
    path.join(__dirname, 'utils')
];

console.log("==================================================");
console.log("CTF-UTILS 测试报告");
console.log("==================================================\n");

let totalPassed = 0;
let totalTests = 0;

// 运行所有测试目录中的测试文件
for (const testDir of testDirs) {
    if (fs.existsSync(testDir)) {
        const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));
        
        console.log(`测试目录: ${path.basename(testDir)}`);
        console.log(`找到 ${testFiles.length} 个测试文件\n`);
        
        for (const testFile of testFiles) {
            const testPath = path.join(testDir, testFile);
            const testName = testFile.replace('.test.js', '');
            
            try {
                console.log(`运行 ${testFile}...`);
                execSync(`node "${testPath}"`, { encoding: 'utf8', stdio: 'pipe' });
                console.log(`✅ ${testName} 测试通过\n`);
                totalPassed++;
            } catch (error) {
                console.log(`❌ ${testName} 测试失败`);
                console.log(`错误: ${error.message}\n`);
            }
            totalTests++;
        }
    }
}

console.log("==================================================");
console.log(`测试完成: ${totalPassed}/${totalTests} 通过`);
console.log("==================================================");