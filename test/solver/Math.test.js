const {
    // 线性代数
    matrixMultiply, matrixDeterminant, matrixInverse,
    
    // 数论
    gcd, lcm, extendedGcd, modInverse, solveLinearCongruence, solveCRT, isPrime, modPow, factorize, pollardsRho, eulerTotient, mobiusFunction, findPrimitiveRoot,
    
    // 组合数学
    binomialCoefficient, generatePermutations, generateCombinations, generateSubsets,
    
    // 其他
    discreteLogarithm, legendreSymbol, solveQuadraticCongruence
} = require('../../lib/solver/Math');

const TIMEOUT_MS = 20000;

const timer = setTimeout(() => {
    console.log(`\n❌ 测试超时 (${TIMEOUT_MS}ms)`);
    process.exit(1);
}, TIMEOUT_MS);

async function runTests() {
    console.log("【Math 模块测试】\n");

    let passed = 0;
    let total = 25;

    // 线性代数测试
    try {
        console.log("1. 测试矩阵乘法");
        const a = [[1, 2], [3, 4]];
        const b = [[5, 6], [7, 8]];
        const result = matrixMultiply(a, b);
        console.log(`   结果: [[${result[0]}], [${result[1]}]]`);
        if (result[0][0] === 19 && result[0][1] === 22 && result[1][0] === 43 && result[1][1] === 50) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n2. 测试矩阵行列式");
        const matrix = [[1, 2], [3, 4]];
        const det = matrixDeterminant(matrix);
        console.log(`   行列式: ${det}`);
        if (det === -2) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 -2`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n3. 测试矩阵求逆");
        const matrix = [[1, 2], [3, 4]];
        const inverse = matrixInverse(matrix);
        console.log(`   逆矩阵: [[${inverse[0]}], [${inverse[1]}]]`);
        if (Math.abs(inverse[0][0] + 2) < 0.0001 && Math.abs(inverse[0][1] - 1) < 0.0001 && 
            Math.abs(inverse[1][0] - 1.5) < 0.0001 && Math.abs(inverse[1][1] + 0.5) < 0.0001) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    // 数论测试
    try {
        console.log("\n4. 测试最大公约数 (GCD)");
        const g = gcd(48n, 18n);
        console.log(`   gcd(48, 18) = ${g}`);
        if (g === 6n) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 6`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n5. 测试最小公倍数 (LCM)");
        const l = lcm(12n, 18n);
        console.log(`   lcm(12, 18) = ${l}`);
        if (l === 36n) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 36`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n6. 测试扩展欧几里得算法");
        const [g, x, y] = extendedGcd(1234n, 5678n);
        console.log(`   gcd(1234, 5678) = ${g}, x = ${x}, y = ${y}`);
        if (g === 2n && (1234n * x + 5678n * y) === g) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n7. 测试模逆元");
        const inv = modInverse(3n, 11n);
        console.log(`   3 在模 11 下的逆元: ${inv}`);
        if (inv === 4n && (3n * inv) % 11n === 1n) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 4`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n8. 测试求解线性同余方程");
        const x = solveLinearCongruence(3n, 2n, 7n);
        console.log(`   方程 3x ≡ 2 mod 7 的解: ${x}`);
        if ((3n * x) % 7n === 2n) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n9. 测试中国剩余定理");
        const congruences = [[2n, 3n], [3n, 5n], [2n, 7n]];
        const x = solveCRT(congruences);
        console.log(`   同余方程组的解: ${x}`);
        if (x % 3n === 2n && x % 5n === 3n && x % 7n === 2n) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n10. 测试素数检测");
        const prime = isPrime(101n);
        const composite = isPrime(100n);
        console.log(`   101 是素数: ${prime}, 100 是素数: ${composite}`);
        if (prime && !composite) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n11. 测试模幂运算");
        const result = modPow(2n, 10n, 1000n);
        console.log(`   2^10 mod 1000 = ${result}`);
        if (result === 24n) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 24`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n12. 测试试除法因式分解");
        const n = 123456n;
        const factors = factorize(n);
        console.log(`   因式分解 ${n}: ${factors.join(' * ')}`);
        const product = factors.reduce((a, b) => a * b, 1n);
        if (product === n) {
            console.log(`   ✅ 因式分解正确`);
            passed++;
        } else {
            console.log(`   ❌ 因式分解错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    // 之前的测试
    try {
        console.log("\n13. 测试 Pollard's Rho 算法因式分解");
        const n1 = 123456789n;
        const factors1 = pollardsRho(n1);
        console.log(`   因式分解 ${n1}: ${factors1.join(' * ')}`);
        const product1 = factors1.reduce((a, b) => a * b, 1n);
        if (product1 === n1) {
            console.log(`   ✅ 因式分解正确`);
            passed++;
        } else {
            console.log(`   ❌ 因式分解错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n14. 测试 Euler's Totient 函数");
        const n2 = 100n;
        const phi2 = eulerTotient(n2);
        console.log(`   φ(${n2}) = ${phi2}`);
        if (phi2 === 40n) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 40`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n15. 测试 Möbius 函数");
        const n3 = 30n;
        const mu3 = mobiusFunction(n3);
        console.log(`   μ(${n3}) = ${mu3}`);
        if (mu3 === -1) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 -1`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n16. 测试寻找原根 (mod 7)");
        const p1 = 7n;
        const g1 = findPrimitiveRoot(p1);
        console.log(`   模 ${p1} 的原根: ${g1}`);
        if (g1 === 3n || g1 === 5n) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 3 或 5`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    // 组合数学测试
    try {
        console.log("\n17. 测试二项式系数");
        const c = binomialCoefficient(5, 2);
        console.log(`   C(5, 2) = ${c}`);
        if (c === 10) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 10`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n18. 测试生成排列");
        const arr = [1, 2, 3];
        const permutations = generatePermutations(arr);
        console.log(`   排列数量: ${permutations.length}`);
        if (permutations.length === 6) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 6`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n19. 测试生成组合");
        const arr = [1, 2, 3, 4];
        const combinations = generateCombinations(arr, 2);
        console.log(`   组合数量: ${combinations.length}`);
        if (combinations.length === 6) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 6`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n20. 测试生成子集");
        const arr = [1, 2, 3];
        const subsets = generateSubsets(arr);
        console.log(`   子集数量: ${subsets.length}`);
        if (subsets.length === 8) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 8`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    // 其他测试
    try {
        console.log("\n21. 测试离散对数");
        const g = 2n;
        const h = 8n;
        const p = 11n;
        const x = discreteLogarithm(g, h, p);
        console.log(`   log_${g}(${h}) mod ${p} = ${x}`);
        if (modPow(g, x, p) === h) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n22. 测试勒让德符号");
        const ls = legendreSymbol(2n, 7n);
        console.log(`   (2|7) = ${ls}`);
        if (ls === 1) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 1`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n23. 测试求解二次同余方程");
        const [x1, x2] = solveQuadraticCongruence(2n, 7n);
        console.log(`   方程 x² ≡ 2 mod 7 的解: ${x1}, ${x2}`);
        if ((x1 * x1) % 7n === 2n && (x2 * x2) % 7n === 2n) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n24. 测试 Pollard's Rho 算法（大质数）");
        const n5 = 999999937n; // 大质数
        const factors5 = pollardsRho(n5);
        console.log(`   因式分解 ${n5}: ${factors5.join(' * ')}`);
        const product5 = factors5.reduce((a, b) => a * b, 1n);
        if (product5 === n5 && factors5.length === 1) {
            console.log(`   ✅ 因式分解正确（识别为质数）`);
            passed++;
        } else {
            console.log(`   ❌ 因式分解错误`);
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
    }

    try {
        console.log("\n25. 测试 Euler's Totient 函数（质数）");
        const n6 = 101n;
        const phi6 = eulerTotient(n6);
        console.log(`   φ(${n6}) = ${phi6}`);
        if (phi6 === 100n) {
            console.log(`   ✅ 结果正确`);
            passed++;
        } else {
            console.log(`   ❌ 结果错误，预期 100`);
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
