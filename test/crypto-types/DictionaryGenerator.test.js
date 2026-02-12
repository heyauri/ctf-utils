const DictionaryGenerator = require('../../lib/crypto-types/DictionaryGenerator.js');

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

async function runTests() {
    console.log("【Dictionary Generator 测试】\n");

    let passed = 0;
    let total = 5;

    try {
        console.log("1. 测试基本字典生成");
        const basicDict = DictionaryGenerator.generateDictionary({ length: 2, charset: 'ab' });
        console.log(`   生成的字典: ${basicDict.join(', ')}`);
        console.log(`   预期数量: 4, 实际数量: ${basicDict.length}`);
        if (basicDict.length === 4) {
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   ❌`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n2. 测试日期格式生成");
        const dates = DictionaryGenerator.generateDateFormats(2023, 2023, ['YYYY-MM-DD']).slice(0, 5);
        console.log(`   生成的日期: ${dates.join(', ')}`);
        console.log(`   生成数量: ${dates.length}`);
        if (dates.length > 0) {
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   ❌`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n3. 测试键盘路径生成");
        const keyboardPaths = DictionaryGenerator.generateKeyboardPaths('qwerty', 2).slice(0, 10);
        console.log(`   生成的路径: ${keyboardPaths.join(', ')}`);
        console.log(`   生成数量: ${keyboardPaths.length}`);
        if (keyboardPaths.length > 0) {
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   ❌`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n4. 测试 Leet Speak 生成");
        const leetWords = DictionaryGenerator.generateLeetSpeak(['test']).slice(0, 10);
        console.log(`   生成的 Leet 变体: ${leetWords.join(', ')}`);
        console.log(`   生成数量: ${leetWords.length}`);
        if (leetWords.length > 0) {
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   ❌`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n5. 测试常见密码生成");
        const commonPasswords = DictionaryGenerator.generateCommonPasswords(['test']).slice(0, 10);
        console.log(`   生成的密码: ${commonPasswords.join(', ')}`);
        console.log(`   生成数量: ${commonPasswords.length}`);
        if (commonPasswords.length > 0) {
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   ❌`);
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
