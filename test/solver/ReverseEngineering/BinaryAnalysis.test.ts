import * as BinaryAnalysis from '../../../src/solver/ReverseEngineering/BinaryAnalysis';
import * as fs from 'fs';
import * as path from 'path';

describe('Binary Analysis', () => {
  const testBinaryPath = path.join(__dirname, 'test-binaries', 'test.txt');

  // Create a test binary file before all tests
  beforeAll(() => {
    // Create test directory if it doesn't exist
    const testDir = path.dirname(testBinaryPath);
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    // Create a simple test file with some strings
    fs.writeFileSync(testBinaryPath, 'Hello, world! This is a test binary file for CTF challenges.');
  });

  // Clean up after all tests
  afterAll(() => {
    if (fs.existsSync(testBinaryPath)) {
      fs.unlinkSync(testBinaryPath);
    }
  });

  describe('detectBinaryType', () => {
    it('should detect text file type', () => {
      const result = BinaryAnalysis.detectBinaryType(testBinaryPath);
      expect(result.type).toBe('text/plain');
      expect(result.architecture).toBe('unknown');
    });
  });

  describe('analyzeBinaryHeader', () => {
    it('should analyze binary header for test file', () => {
      const result = BinaryAnalysis.analyzeBinaryHeader(testBinaryPath);
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('architecture');
      expect(result).toHaveProperty('entryPoint');
      expect(result).toHaveProperty('sections');
      expect(Array.isArray(result.sections)).toBe(true);
    });
  });

  describe('analyzeControlFlow', () => {
    it('should generate control flow graph for test file', () => {
      const result = BinaryAnalysis.analyzeControlFlow(testBinaryPath);
      expect(result).toHaveProperty('functions');
      expect(result).toHaveProperty('basicBlocks');
      expect(result).toHaveProperty('entryPoint');
      expect(result).toHaveProperty('binaryType');
      expect(result).toHaveProperty('architecture');
      expect(Array.isArray(result.functions)).toBe(true);
      expect(result.basicBlocks instanceof Map).toBe(true);
    });
  });

  describe('disassembleBinary', () => {
    it('should disassemble binary file', () => {
      const startAddress = '0x0';
      const endAddress = '0x100';
      const result = BinaryAnalysis.disassembleBinary(testBinaryPath, startAddress, endAddress);
      expect(Array.isArray(result)).toBe(true);
      result.forEach(instruction => {
        expect(instruction).toHaveProperty('address');
        expect(instruction).toHaveProperty('mnemonic');
        expect(instruction).toHaveProperty('operands');
        expect(instruction).toHaveProperty('size');
      });
    });
  });

  describe('identifyFunctions', () => {
    it('should identify functions in binary file', () => {
      const result = BinaryAnalysis.identifyFunctions(testBinaryPath);
      expect(Array.isArray(result)).toBe(true);
      result.forEach(func => {
        expect(func).toHaveProperty('name');
        expect(func).toHaveProperty('startAddress');
        expect(func).toHaveProperty('endAddress');
        expect(func).toHaveProperty('basicBlocks');
        expect(func).toHaveProperty('callers');
        expect(func).toHaveProperty('callees');
      });
    });
  });

  describe('generateCallGraph', () => {
    it('should generate call graph for binary file', () => {
      const result = BinaryAnalysis.generateCallGraph(testBinaryPath);
      expect(result instanceof Map).toBe(true);
    });
  });

  describe('analyzeStrings', () => {
    it('should extract strings from binary file', () => {
      const result = BinaryAnalysis.analyzeStrings(testBinaryPath);
      expect(Array.isArray(result)).toBe(true);
      result.forEach(strObj => {
        expect(strObj).toHaveProperty('address');
        expect(strObj).toHaveProperty('string');
      });
      // Check if it found our test string
      const hasHelloWorld = result.some(strObj => strObj.string.includes('Hello, world!'));
      expect(hasHelloWorld).toBe(true);
    });

    it('should respect minimum string length parameter', () => {
      const minLength = 10;
      const result = BinaryAnalysis.analyzeStrings(testBinaryPath, minLength);
      expect(Array.isArray(result)).toBe(true);
      result.forEach(strObj => {
        expect(strObj.string.length).toBeGreaterThanOrEqual(minLength);
      });
    });
  });

  describe('analyzeSymbols', () => {
    it('should analyze symbols in binary file', () => {
      const result = BinaryAnalysis.analyzeSymbols(testBinaryPath);
      expect(result).toHaveProperty('imports');
      expect(result).toHaveProperty('exports');
      expect(Array.isArray(result.imports)).toBe(true);
      expect(Array.isArray(result.exports)).toBe(true);
    });
  });

  describe('analyzeVulnerabilities', () => {
    it('should analyze vulnerabilities in binary file', () => {
      const result = BinaryAnalysis.analyzeVulnerabilities(testBinaryPath);
      expect(Array.isArray(result)).toBe(true);
      result.forEach(vuln => {
        expect(vuln).toHaveProperty('type');
        expect(vuln).toHaveProperty('address');
        expect(vuln).toHaveProperty('description');
      });
    });
  });

  describe('extractSections', () => {
    it('should extract sections from binary file', () => {
      const result = BinaryAnalysis.extractSections(testBinaryPath);
      expect(Array.isArray(result)).toBe(true);
      result.forEach(section => {
        expect(section).toHaveProperty('name');
        expect(section).toHaveProperty('startAddress');
        expect(section).toHaveProperty('size');
        expect(section).toHaveProperty('flags');
      });
    });
  });
});
