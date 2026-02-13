/**
 * Forensics 模块测试
 */

const { Forensics } = require('../../lib/solver/index.js');
const { BinaryFile } = Forensics;

console.log('【Forensics 模块测试】');
console.log('');

// 测试二进制文件分析功能
console.log('1. 测试二进制文件类型检测');
try {
  // 创建一个简单的二进制缓冲区（PNG 文件头）
  const pngBuffer = Buffer.from('89504E470D0A1A0A', 'hex');
  const detectedTypes = BinaryFile.detect(pngBuffer);
  console.log(`   检测结果: ${detectedTypes}`);
  console.log(`   ${detectedTypes.includes('png') ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试二进制文件头部提取
console.log('2. 测试二进制文件头部提取');
try {
  const testBuffer = Buffer.from('89504E470D0A1A0A0000000D49484452', 'hex');
  const header = BinaryFile.extractHeader(testBuffer);
  console.log(`   头部长度: ${header.bytes.length} 字节`);
  console.log(`   头部十六进制: ${header.hex.slice(0, 32)}...`);
  console.log(`   头部ASCII: ${header.ascii.slice(0, 32)}...`);
  console.log(`   检测到的类型: ${header.detectedTypes}`);
  console.log(`   ✅ 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试二进制数据模式搜索
console.log('3. 测试二进制数据模式搜索');
try {
  const testBuffer = Buffer.from('00112233445566778899', 'hex');
  const pattern = '3344';
  const offsets = BinaryFile.searchPattern(testBuffer, pattern);
  console.log(`   搜索模式: ${pattern}`);
  console.log(`   找到的偏移量: ${offsets}`);
  console.log(`   ${offsets.includes(3) ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试二进制数据区域提取
console.log('4. 测试二进制数据区域提取');
try {
  const testBuffer = Buffer.from('00112233445566778899', 'hex');
  const extracted = BinaryFile.extractRegion(testBuffer, 2, 4);
  console.log(`   提取区域: 偏移量 2, 长度 4`);
  console.log(`   提取结果: ${extracted.toString('hex')}`);
  console.log(`   ${extracted.toString('hex') === '22334455' ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试二进制数据统计分析
console.log('5. 测试二进制数据统计分析');
try {
  const testBuffer = Buffer.from('00112233445566778899', 'hex');
  const stats = BinaryFile.analyzeStatistics(testBuffer);
  console.log(`   数据大小: ${stats.size} 字节`);
  console.log(`   熵值: ${stats.entropy.toFixed(4)}`);
  console.log(`   零字节数: ${stats.zeroBytes}`);
  console.log(`   唯一字节数: ${stats.uniqueBytes}`);
  console.log(`   可打印ASCII数: ${stats.printableAscii}`);
  console.log(`   ✅ 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试二进制缓冲区比较
console.log('6. 测试二进制缓冲区比较');
try {
  const buffer1 = Buffer.from('00112233', 'hex');
  const buffer2 = Buffer.from('0011AA33', 'hex');
  const comparison = BinaryFile.compareBuffers(buffer1, buffer2);
  console.log(`   是否相同: ${comparison.identical}`);
  console.log(`   大小是否匹配: ${comparison.sizeMatch}`);
  console.log(`   不同偏移量: ${comparison.differingOffsets}`);
  console.log(`   相似度: ${(comparison.similarity * 100).toFixed(2)}%`);
  console.log(`   ✅ 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试字节查找
console.log('7. 测试字节查找');
try {
  const testBuffer = Buffer.from('001122113311', 'hex');
  const byteValue = 0x11;
  const offsets = BinaryFile.findByte(testBuffer, byteValue);
  console.log(`   查找字节: 0x${byteValue.toString(16)}`);
  console.log(`   找到的偏移量: ${offsets}`);
  console.log(`   ${JSON.stringify(offsets) === JSON.stringify([1, 3, 5]) ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试字符串提取
console.log('8. 测试字符串提取');
try {
  const testBuffer = Buffer.from('48656C6C6F20576F726C640048656C6C6F', 'hex');
  const strings = BinaryFile.extractStrings(testBuffer);
  console.log(`   提取的字符串: ${strings}`);
  console.log(`   ${strings.includes('Hello World') && strings.includes('Hello') ? '✅' : '❌'} 结果正确`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

console.log('【测试完成】');
