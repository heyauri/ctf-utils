const ctf = require('../../lib/index.js');
const { encode } = ctf;

const tests = ["Hello", "World", "CTF{test}"];

console.log("【MD5 测试】\n");

let passed = 0;
let total = tests.length;

const expectedHashes = {
    "Hello": "8b1a9953c4611296a827abf8c47804d7",
    "World": "f5a7924e621e84c9280a9a27e1bcb7f6",
    "CTF{test}": "ffcc100d4fa9a73a16b8758a05ca55a2"
};

for (const input of tests) {
    const hash = encode.MD5(input);
    const expected = expectedHashes[input];
    
    console.log(`  MD5: "${input}" -> "${hash}"`);
    console.log(`       expected: "${expected}"`);
    
    if (hash === expected) {
        passed++;
        console.log(`    ✅`);
    } else {
        console.log(`    ❌`);
    }
}

console.log(`\n结果: ${passed}/${total} 通过\n`);