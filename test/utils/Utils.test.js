const { asyncExecute, executeWithTimeout } = require('../../lib/utils/Utils');

const TIMEOUT_MS = 15000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

async function runTests() {
    console.log("【Utils 模块测试】\n");

    let passed = 0;
    let total = 5;

    try {
        console.log("1. 测试 asyncExecute 执行同步函数");
        const syncFn = () => {
            return "Hello, sync!";
        };
        const syncResult = await asyncExecute(syncFn);
        console.log(`   结果: ${syncResult}`);
        if (syncResult === "Hello, sync!") {
            console.log(`   ✅ 同步函数执行成功`);
            passed++;
        } else {
            console.log(`   ❌ 同步函数执行失败`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n2. 测试 asyncExecute 执行异步函数");
        const asyncFn = async () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve("Hello, async!");
                }, 100);
            });
        };
        const asyncResult = await asyncExecute(asyncFn);
        console.log(`   结果: ${asyncResult}`);
        if (asyncResult === "Hello, async!") {
            console.log(`   ✅ 异步函数执行成功`);
            passed++;
        } else {
            console.log(`   ❌ 异步函数执行失败`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n3. 测试 asyncExecute 超时功能");
        const timeoutFn = async () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve("Hello, timeout!");
                }, 1000);
            });
        };
        await asyncExecute(timeoutFn, 500);
        console.log(`   ❌ 超时测试失败（应该抛出超时错误）`);
    } catch (error) {
        if (error.message.includes("timed out")) {
            console.log(`   ✅ 超时测试成功，捕获到超时错误`);
            passed++;
        } else {
            console.log(`   ❌ 错误: ${error.message}`);
        }
    }

    try {
        console.log("\n4. 测试 executeWithTimeout 函数");
        const testFn = async () => {
            return "Hello, executeWithTimeout!";
        };
        const result = await executeWithTimeout(testFn, 1000);
        console.log(`   结果: ${result}`);
        if (result === "Hello, executeWithTimeout!") {
            console.log(`   ✅ executeWithTimeout 执行成功`);
            passed++;
        } else {
            console.log(`   ❌ executeWithTimeout 执行失败`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n5. 测试 executeWithTimeout 超时功能");
        const timeoutFn = async () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve("Hello, timeout!");
                }, 1000);
            });
        };
        await executeWithTimeout(timeoutFn, 500);
        console.log(`   ❌ 超时测试失败（应该抛出超时错误）`);
    } catch (error) {
        if (error.message.includes("timed out")) {
            console.log(`   ✅ 超时测试成功，捕获到超时错误`);
            passed++;
        } else {
            console.log(`   ❌ 错误: ${error.message}`);
        }
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
