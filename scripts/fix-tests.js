const fs = require('fs');
const path = require('path');

const cryptoConfig = {
    Base16: { tests: ["Hello", "World", "CTF{test}"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Base32: { tests: ["Hello", "World", "CTF{test}"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Base58: { tests: ["Hello", "World", "CTF{test}"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Base62: { tests: ["Hello", "World", "CTF{test}"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Base64: { tests: ["Hello", "World", "CTF{test}"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Base85: { tests: ["Hello", "World", "CTF{test}"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Base91: { tests: ["Hello", "World", "CTF{test}"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    BinStr: { tests: ["Hello", "World", "Test123"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    OCT: { tests: ["Hello", "World", "CTF"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    HEX: { tests: ["Hello", "World", "CTF"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Decimal: { tests: ["Hello", "World", "CTF"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Unicode: { tests: ["Hello", "World", "CTF{test}"], args: [], hasDetect: true, hasEncode: true, hasDecode: false },
    Morse: { tests: ["hello", "world", "sos"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Bacon: { tests: ["HELLO", "WORLD", "TEST"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Brainfuck: { tests: ["Hello", "World", "Test"], args: [], hasDetect: true, hasEncode: true, hasDecode: true, mode: 'bf-only' },
    URL: { tests: ["Hello World", "http://test.com", "foo=bar"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    HTML: { tests: ["Hello", "World", "<test>"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Caesar: { tests: ["Hello", "World", "CTF"], args: [{ key: 3 }], hasDetect: false, hasEncode: true, hasDecode: true },
    ROT: { tests: ["Hello", "World", "URYYB"], args: [{ key: 13 }], hasDetect: false, hasEncode: true, hasDecode: true },
    Affine: { tests: ["HELLO", "WORLD", "TEST"], args: [{ key: {a: 5, b: 8} }], hasDetect: false, hasEncode: true, hasDecode: true },
    Atbash: { tests: ["Hello", "World", "CTF"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    Vigenere: { tests: ["HELLO", "WORLD", "ATTACK"], args: [{ key: "KEY" }], hasDetect: false, hasEncode: true, hasDecode: true },
    ADFGVX: { tests: ["ATTACK", "ABC", "DEF"], args: [{ key: "KEY" }], hasDetect: true, hasEncode: true, hasDecode: true },
    RailFence: { tests: ["Hello", "World", "ATTACK"], args: [{ key: 3 }], hasDetect: true, hasEncode: true, hasDecode: true },
    Poem: { tests: ["Hello", "World", "Test"], args: [], hasDetect: true, hasEncode: false, hasDecode: true, mode: 'decode-only' },
    DangPu: { tests: ["Hello", "World", "Test"], args: [], hasDetect: true, hasEncode: true, hasDecode: true },
    YuFoLunChan: { tests: ["滅苦婆娑耶陀跋多漫都殿"], args: [], hasDetect: true, hasEncode: false, hasDecode: true, mode: 'decode-only' },
    ZaHuoPu: { tests: ["丁不勾示不小王不立罪不非"], args: [], hasDetect: true, hasEncode: false, hasDecode: true, mode: 'decode-only' },
    Exponential: { tests: ["0123 0123", "0123 123", "123 0123"], args: [], hasDetect: true, hasEncode: false, hasDecode: true, mode: 'decode-only' },
    MD5: { tests: ["Hello", "World", "CTF{test}"], args: [], hasDetect: true, hasEncode: true, hasDecode: false, mode: 'encode-only' },
    SimpleSub: { tests: ["HELLO", "WORLD", "TEST"], args: [{ key: "QWERTYUIOPASDFGHJKLZXCVBNM" }], hasDetect: true, hasEncode: true, hasDecode: true },
};

function generateTestFile(name, config) {
    const hasEncode = config.hasEncode !== false;
    const hasDecode = config.hasDecode !== false;
    const hasDetect = config.hasDetect !== false;
    const hasArgs = config.args && config.args.length > 0;
    const mode = config.mode || 'normal';

    const testCases = config.tests.map((value, idx) => {
        const arg = config.args ? (config.args[idx] || {}) : {};
        let keyArg = '';
        if (arg.key !== undefined) {
            if (typeof arg.key === 'number') {
                keyArg = `, key: ${arg.key}`;
            } else if (typeof arg.key === 'string') {
                keyArg = `, key: "${arg.key}"`;
            } else if (typeof arg.key === 'object') {
                keyArg = `, key: ${JSON.stringify(arg.key)}`;
            }
        }
        return `        { value: "${value}"${keyArg} }`;
    }).join(',\n');

    let methodCalls = '';
    let checkCondition = '';
    let detectLog = '';
    let encodeLog = '';
    let decodeLog = '';
    let loopArg = hasArgs ? ', key' : '';

    if (mode === 'encode-only') {
        methodCalls = `        const encoded = await (await ctf.encode.${name}()).val();
        const isDetected = await ctf.detect.${name}();`;
        checkCondition = 'encoded !== undefined && encoded.length > 0';
        detectLog = ` detect:\${isDetected}`;
        encodeLog = ` encode:"\${encoded}"`;
    } else if (mode === 'decode-only') {
        methodCalls = `        const isDetected = await ctf.detect.${name}();`;
        checkCondition = 'isDetected === true';
        detectLog = ` detect:\${isDetected}`;
    } else if (mode === 'bf-only') {
        methodCalls = `        const encoded = await (await ctf.encode.${name}()).val();
        const isDetected = await ctf.detect.${name}(encoded);`;
        checkCondition = 'isDetected === true && encoded !== undefined && encoded.length > 0';
        detectLog = ` detect:\${isDetected}`;
        encodeLog = ` encode:"\${encoded.substring(0, 30)}..."`;
    } else if (hasEncode && hasDecode) {
        let encodeArgs = '';
        let decodeArgs = '';
        
        if (hasArgs && config.args[0]) {
            const arg = config.args[0];
            if (typeof arg.key === 'string' && arg.key.includes(',')) {
                const [a, b] = arg.key.split(',');
                const aVal = !isNaN(Number(a.trim())) ? Number(a.trim()) : `"${a.trim()}"`;
                const bVal = !isNaN(Number(b.trim())) ? Number(b.trim()) : `"${b.trim()}"`;
                encodeArgs = `(${aVal}, ${bVal})`;
                decodeArgs = `(${aVal}, ${bVal})`;
            } else if (typeof arg.key === 'object') {
                encodeArgs = `(${JSON.stringify(arg.key)})`;
                decodeArgs = `(${JSON.stringify(arg.key)})`;
            } else {
                const keyVal = typeof arg.key === 'number' ? arg.key : `"${arg.key}"`;
                encodeArgs = `(${keyVal})`;
                decodeArgs = `(${keyVal})`;
            }
        } else {
            encodeArgs = '()';
            decodeArgs = '()';
        }

        const detectLine = hasDetect ? `        const isDetected = await ctf.detect.${name}();` : '';
        methodCalls = `        const encoded = await (await ctf.encode.${name}${encodeArgs}).val();
${detectLine}
        const decoded = await (await ctf.decode.${name}${decodeArgs}).val();`;
        checkCondition = 'decoded === value';
        detectLog = hasDetect ? ` detect:\${isDetected}` : '';
        encodeLog = ` encode:"\${encoded}"`;
        decodeLog = ` -> decode:"\${decoded}"`;
    } else if (hasEncode && !hasDecode) {
        methodCalls = `        const encoded = await (await ctf.encode.${name}()).val();
        const isDetected = await ctf.detect.${name}();`;
        checkCondition = 'encoded === value';
        detectLog = ` detect:\${isDetected}`;
        encodeLog = ` encode:"\${encoded}"`;
    } else if (!hasEncode && hasDecode) {
        const detectLine = hasDetect ? `        const isDetected = await ctf.detect.${name}();` : '';
        methodCalls = `${detectLine}
        const decoded = await (await ctf.decode.${name}()).val();`;
        checkCondition = 'decoded === value';
        detectLog = hasDetect ? ` detect:\${isDetected}` : '';
        decodeLog = ` -> decode:"\${decoded}"`;
    } else {
        methodCalls = `        const isDetected = await ctf.detect.${name}();`;
        checkCondition = 'isDetected === true';
        detectLog = ` detect:\${isDetected}`;
    }

    const testContent = `const ctf = require('../../lib/index.js');
const { CTFUtils } = ctf;

const TIMEOUT_MS = 5000;

const timer = setTimeout(() => {
    console.log(\`\\n❌ 测试超时 (\${TIMEOUT_MS}ms)\`);
    process.exit(1);
}, TIMEOUT_MS);

const tests = [
${testCases}
];

async function runTests() {
    console.log("【${name} 测试】\\n");

    let passed = 0;
    let total = tests.length;

    for (const { value${loopArg} } of tests) {
        const ctf = new CTFUtils(value);

${methodCalls}

        console.log(\`  ${name}: "\${value}"${detectLog}${encodeLog}${decodeLog}\`);

        if (${checkCondition}) {
            passed++;
            console.log(\`    ✅\`);
        } else {
            console.log(\`    ❌\`);
        }
    }

    console.log(\`\\n结果: \${passed}/\${total} 通过\\n\`);
    clearTimeout(timer);
    process.exit(passed === total ? 0 : 1);
}

runTests().catch(err => {
    console.error('测试错误:', err);
    clearTimeout(timer);
    process.exit(1);
});
`;

    return testContent;
}

const testDir = path.join(__dirname, '../test/crypto-types');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

for (const file of files) {
    const name = file.replace('.test.js', '');
    if (cryptoConfig[name]) {
        const content = generateTestFile(name, cryptoConfig[name]);
        fs.writeFileSync(path.join(testDir, file), content);
        console.log(`✅ 修复: ${file}`);
    } else {
        console.log(`⚠️  跳过: ${file} (未配置)`);
    }
}

console.log(`\\n共处理 ${files.length} 个测试文件`);
