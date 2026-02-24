/**
 * ReverseEngineering 模块测试
 */

const solver = require('../../lib/solver/index.js');
const fs = require('fs');
const path = require('path');

const { BinaryAnalysis } = solver.ReverseEngineering;

console.log('【ReverseEngineering 模块测试】');
console.log('');

// 测试控制流分析
console.log('1. 测试控制流分析');
try {
  const binaryPath = path.join(__dirname, 'test.bin');
  fs.writeFileSync(binaryPath, 'test binary content');
  
  try {
    const cflow = BinaryAnalysis.analyzeControlFlow(binaryPath);
    console.log(`   ${cflow ? '✅' : '❌'} 控制流分析测试通过`);
  } finally {
    if (fs.existsSync(binaryPath)) {
      fs.unlinkSync(binaryPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试二进制反汇编
console.log('2. 测试二进制反汇编');
try {
  const binaryPath = path.join(__dirname, 'test.bin');
  fs.writeFileSync(binaryPath, 'test binary content');
  
  try {
    const startAddress = '0x08048000';
    const endAddress = '0x08048100';
    const instructions = BinaryAnalysis.disassembleBinary(binaryPath, startAddress, endAddress);
    console.log(`   ${Array.isArray(instructions) ? '✅' : '❌'} 二进制反汇编测试通过`);
  } finally {
    if (fs.existsSync(binaryPath)) {
      fs.unlinkSync(binaryPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试函数识别
console.log('3. 测试函数识别');
try {
  const binaryPath = path.join(__dirname, 'test.bin');
  fs.writeFileSync(binaryPath, 'test binary content');
  
  try {
    const functions = BinaryAnalysis.identifyFunctions(binaryPath);
    console.log(`   ${Array.isArray(functions) ? '✅' : '❌'} 函数识别测试通过`);
  } finally {
    if (fs.existsSync(binaryPath)) {
      fs.unlinkSync(binaryPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试调用图生成
console.log('4. 测试调用图生成');
try {
  const binaryPath = path.join(__dirname, 'test.bin');
  fs.writeFileSync(binaryPath, 'test binary content');
  
  try {
    const callGraph = BinaryAnalysis.generateCallGraph(binaryPath);
    console.log(`   ${callGraph ? '✅' : '❌'} 调用图生成测试通过`);
  } finally {
    if (fs.existsSync(binaryPath)) {
      fs.unlinkSync(binaryPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试字符串分析
console.log('5. 测试字符串分析');
try {
  const binaryPath = path.join(__dirname, 'test.bin');
  fs.writeFileSync(binaryPath, 'test binary content with string Hello, world!');
  
  try {
    const strings = BinaryAnalysis.analyzeStrings(binaryPath);
    console.log(`   ${Array.isArray(strings) ? '✅' : '❌'} 字符串分析测试通过`);
  } finally {
    if (fs.existsSync(binaryPath)) {
      fs.unlinkSync(binaryPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试符号分析
console.log('6. 测试符号分析');
try {
  const binaryPath = path.join(__dirname, 'test.bin');
  fs.writeFileSync(binaryPath, 'test binary content');
  
  try {
    const symbols = BinaryAnalysis.analyzeSymbols(binaryPath);
    console.log(`   ${symbols ? '✅' : '❌'} 符号分析测试通过`);
  } finally {
    if (fs.existsSync(binaryPath)) {
      fs.unlinkSync(binaryPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试二进制结构分析
console.log('7. 测试二进制结构分析');
try {
  const binaryPath = path.join(__dirname, 'test.bin');
  fs.writeFileSync(binaryPath, 'test binary content');
  
  try {
    const structure = BinaryAnalysis.analyzeBinaryStructure(binaryPath);
    console.log(`   ${structure ? '✅' : '❌'} 二进制结构分析测试通过`);
  } finally {
    if (fs.existsSync(binaryPath)) {
      fs.unlinkSync(binaryPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试二进制安全分析
console.log('8. 测试二进制安全分析');
try {
  const binaryPath = path.join(__dirname, 'test.bin');
  fs.writeFileSync(binaryPath, 'test binary content');
  
  try {
    const security = BinaryAnalysis.analyzeBinarySecurity(binaryPath);
    console.log(`   ${security ? '✅' : '❌'} 二进制安全分析测试通过`);
  } finally {
    if (fs.existsSync(binaryPath)) {
      fs.unlinkSync(binaryPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试漏洞分析
console.log('9. 测试漏洞分析');
try {
  const binaryPath = path.join(__dirname, 'test.bin');
  fs.writeFileSync(binaryPath, 'test binary content');
  
  try {
    const vulnerabilities = BinaryAnalysis.analyzeVulnerabilities(binaryPath);
    console.log(`   ${Array.isArray(vulnerabilities) ? '✅' : '❌'} 漏洞分析测试通过`);
  } finally {
    if (fs.existsSync(binaryPath)) {
      fs.unlinkSync(binaryPath);
    }
  }
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');
console.log('【测试完成】');
