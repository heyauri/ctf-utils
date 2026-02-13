const ctf = require('../../lib/index.js');
const { DictionaryGenerator } = ctf.solver.Utils;

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

async function runTests() {
    console.log("【Dictionary Generator 测试】\n");

    let passed = 0;
    let total = 10;

    try {
        console.log("1. 测试基本字典生成 (长度2, 字符集'ab')");
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
        console.log("\n2. 测试日期格式生成 (2023年)");
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
        console.log("\n3. 测试键盘路径生成 (基于'qwerty')");
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
        console.log("\n4. 测试 Leet Speak 生成 (基于'test')");
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
        console.log("\n5. 测试常见密码生成 (基于'test')");
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

    try {
        console.log("\n6. 测试基本字典生成 (长度3, 字符集'123')");
        const basicDict2 = DictionaryGenerator.generateDictionary({ length: 3, charset: '123' });
        console.log(`   生成数量: ${basicDict2.length}`);
        console.log(`   预期数量: 27, 实际数量: ${basicDict2.length}`);
        if (basicDict2.length === 27) {
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   ❌`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n7. 测试日期格式生成 (多格式)");
        const dates2 = DictionaryGenerator.generateDateFormats(2022, 2023, ['YYYY-MM-DD', 'MM/DD/YYYY']).slice(0, 10);
        console.log(`   生成的日期: ${dates2.join(', ')}`);
        console.log(`   生成数量: ${dates2.length}`);
        if (dates2.length > 0) {
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   ❌`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n8. 测试多个单词的Leet Speak生成");
        const leetWords2 = DictionaryGenerator.generateLeetSpeak(['test', 'hello']).slice(0, 10);
        console.log(`   生成的 Leet 变体: ${leetWords2.join(', ')}`);
        console.log(`   生成数量: ${leetWords2.length}`);
        if (leetWords2.length > 0) {
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   ❌`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n9. 测试多个基础单词的常见密码生成");
        const commonPasswords2 = DictionaryGenerator.generateCommonPasswords(['test', 'admin']).slice(0, 10);
        console.log(`   生成的密码: ${commonPasswords2.join(', ')}`);
        console.log(`   生成数量: ${commonPasswords2.length}`);
        if (commonPasswords2.length > 0) {
            console.log(`   ✅`);
            passed++;
        } else {
            console.log(`   ❌`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n10. 测试边界情况 (长度1, 字符集'abc')");
        const basicDict3 = DictionaryGenerator.generateDictionary({ length: 1, charset: 'abc' });
        console.log(`   生成的字典: ${basicDict3.join(', ')}`);
        console.log(`   预期数量: 3, 实际数量: ${basicDict3.length}`);
        if (basicDict3.length === 3) {
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
