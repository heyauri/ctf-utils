import * as HashAttacks from '../../../../src/solver/Crypto/Hash/hashAttacks';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

describe('Hash Attacks', () => {
  describe('analyzeHashType', () => {
    it('should correctly identify MD5 hash', () => {
      const hash = 'd41d8cd98f00b204e9800998ecf8427e'; // Empty string MD5
      const result = HashAttacks.analyzeHashType(hash);
      expect(result).toContain('MD5');
    });

    it('should correctly identify SHA-1 hash', () => {
      const hash = 'da39a3ee5e6b4b0d3255bfef95601890afd80709'; // Empty string SHA-1
      const result = HashAttacks.analyzeHashType(hash);
      expect(result).toContain('SHA1');
    });

    it('should correctly identify SHA-256 hash', () => {
      const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // Empty string SHA-256
      const result = HashAttacks.analyzeHashType(hash);
      expect(result).toContain('SHA256');
    });

    it('should correctly identify SHA-384 hash', () => {
      const hash = '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b'; // Empty string SHA-384
      const result = HashAttacks.analyzeHashType(hash);
      expect(result).toContain('SHA384');
    });

    it('should correctly identify RIPEMD-160 hash', () => {
      const hash = '9c1185a5c5e9fc54612808977ee8f548b2258d31'; // Empty string RIPEMD-160
      const result = HashAttacks.analyzeHashType(hash);
      expect(result).toContain('RIPEMD-160');
    });

    it('should return unknown for invalid hash length', () => {
      const hash = 'invalidhash';
      const result = HashAttacks.analyzeHashType(hash);
      expect(result).toEqual(['Unknown']);
    });
  });

  describe('bruteForceHash', () => {
    it('should correctly brute force a simple password', () => {
      const hash = '5f4dcc3b5aa765d61d8327deb882cf99'; // 'password' MD5
      const charset = 'abcdefghijklmnopqrstuvwxyz';
      const maxLength = 8;
      const result = HashAttacks.bruteForceHash(hash, charset, maxLength, 'md5');
      expect(result).toBe('password');
    });

    it('should return null for not found password', () => {
      const hash = 'd41d8cd98f00b204e9800998ecf8427e'; // Empty string MD5
      const charset = 'abc';
      const maxLength = 2;
      const result = HashAttacks.bruteForceHash(hash, charset, maxLength, 'md5');
      expect(result).toBeNull();
    });
  });

  describe('dictionaryAttack', () => {
    let dictionaryPath: string;

    beforeEach(() => {
      dictionaryPath = path.join(os.tmpdir(), `ctf-utils-test-dict-${Date.now()}.txt`);
      fs.writeFileSync(dictionaryPath, 'admin\npassword\ntest\n123456\n');
    });

    afterEach(() => {
      if (fs.existsSync(dictionaryPath)) {
        fs.unlinkSync(dictionaryPath);
      }
    });

    it('should correctly find password in dictionary', () => {
      const hash = '5f4dcc3b5aa765d61d8327deb882cf99'; // 'password' MD5
      const result = HashAttacks.dictionaryAttack(hash, dictionaryPath, 'md5');
      expect(result).toBe('password');
    });

    it('should return null for password not in dictionary', () => {
      const hash = 'd41d8cd98f00b204e9800998ecf8427e'; // Empty string MD5
      const result = HashAttacks.dictionaryAttack(hash, dictionaryPath, 'md5');
      expect(result).toBeNull();
    });
  });

  describe('hashWithSalt', () => {
    it('should correctly compute salted hash', () => {
      const password = 'password';
      const salt = 'salt123';
      const hashFunction = 'md5';
      const result = HashAttacks.hashWithSalt(password, salt, hashFunction);
      const expected = crypto.createHash(hashFunction).update(password + salt).digest('hex');
      expect(result).toBe(expected);
    });
  });

  describe('bruteForceHashWithSalt', () => {
    it('should correctly brute force salted password', () => {
      const password = 'test';
      const salt = 'salt';
      const hash = crypto.createHash('md5').update(password + salt).digest('hex');
      const charset = 'abcdefghijklmnopqrstuvwxyz';
      const maxLength = 4;
      const result = HashAttacks.bruteForceHashWithSalt(hash, salt, charset, maxLength, 'md5');
      expect(result).toBe(password);
    });
  });

  describe('dictionaryAttackWithSalt', () => {
    it('should correctly find salted password in dictionary', () => {
      const password = 'password';
      const salt = 'salt123';
      const hash = crypto.createHash('md5').update(password + salt).digest('hex');
      const dictionaryPath = path.join(os.tmpdir(), `ctf-utils-test-salted-dict-${Date.now()}.txt`);
      fs.writeFileSync(dictionaryPath, 'admin\npassword\ntest\n123456\n');

      try {
        const result = HashAttacks.dictionaryAttackWithSalt(hash, salt, dictionaryPath, 'md5');
        expect(result).toBe(password);
      } finally {
        fs.unlinkSync(dictionaryPath);
      }
    });
  });

  describe('generateHMAC', () => {
    it('should correctly generate HMAC', () => {
      const data = 'test data';
      const key = 'secretkey';
      const algorithm = 'sha256';
      const result = HashAttacks.generateHMAC(key, data, algorithm);
      const expected = crypto.createHmac(algorithm, key).update(data).digest('hex');
      expect(result).toBe(expected);
    });
  });

  describe('crackHMAC', () => {
    it('should correctly crack HMAC with known key', () => {
      const data = 'test data';
      const key = 'secret';
      const algorithm = 'sha256';
      const hmac = crypto.createHmac(algorithm, key).update(data).digest('hex');
      const charset = 'abcdefghijklmnopqrstuvwxyz';
      const maxLength = 6;
      const result = HashAttacks.crackHMAC(hmac, data, charset, maxLength, algorithm);
      expect(result).toBe(key);
    });

    it('should return null for unknown key', () => {
      const data = 'test data';
      const key = 'secret';
      const algorithm = 'sha256';
      const hmac = crypto.createHmac(algorithm, key).update(data).digest('hex');
      const charset = '0123456789';
      const maxLength = 3;
      const result = HashAttacks.crackHMAC(hmac, data, charset, maxLength, algorithm);
      expect(result).toBeNull();
    });
  });
});
