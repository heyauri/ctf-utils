const FrequencyAnalysis = require('../../lib/crypto-types/FrequencyAnalysis.js');

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

const tests = [
    "Hello World, this is a test message.",
    "The quick brown fox jumps over the lazy dog.",
    "CTF{ThisIsATestFlag}",
    "AAAAAAAAAAAAAAAAAAAA",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
];

async function runTests() {
    console.log("【Frequency Analysis 测试】\n");

    let passed = 0;
    let total = tests.length;

    for (const text of tests) {
        try {
            console.log(`  文本: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
            
            const analysis = FrequencyAnalysis.analyzeFrequency(text);
            console.log(`    总字符数: ${analysis.totalChars}`);
            console.log(`    频率最高的字符: ${analysis.topChars.join(', ')}`);
            
            const ic = FrequencyAnalysis.calculateIC(text);
            console.log(`    重合指数: ${ic}`);
            
            const language = FrequencyAnalysis.detectLanguage(text);
            console.log(`    检测语言: ${language.language} (${language.confidence}%)`);
            
            console.log(`    ✅`);
            passed++;
        } catch (error) {
            console.log(`    ❌ 错误: ${error.message}`);
        }
        console.log();
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
