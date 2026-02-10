const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testDir = path.join(__dirname, 'crypto-types');
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

console.log("==================================================");
console.log("CTF-UTILS 单独测试报告");
console.log("==================================================\n");

let totalPassed = 0;
let totalTests = 0;

for (const testFile of testFiles) {
    const testPath = path.join(testDir, testFile);
    const testName = testFile.replace('.test.js', '');
    
    try {
        console.log(`运行 ${testFile}...`);
        execSync(`node "${testPath}"`, { encoding: 'utf8', stdio: 'pipe' });
        console.log(`✅ ${testName} 测试通过\n`);
    } catch (error) {
        console.log(`❌ ${testName} 测试失败`);
        console.log(`错误: ${error.message}\n`);
    }
}

console.log("==================================================");
console.log("所有单独测试完成");
console.log("==================================================");