import * as RSAUtils from '../../../../src/solver/Crypto/RSA/utils';
import { bigintCryptoUtils } from 'bigint-crypto-utils';

describe('RSA Utils', () => {
  describe('modPow', () => {
    it('should correctly compute modular exponentiation for small values', () => {
      const base = 2n;
      const exponent = 10n;
      const modulus = 1000n;
      const expected = 24n; // 2^10 mod 1000 = 1024 mod 1000 = 24
      const result = RSAUtils.modPow(base, exponent, modulus);
      expect(result).toBe(expected);
    });

    it('should correctly compute modular exponentiation for large values', () => {
      const base = 123456789n;
      const exponent = 987654321n;
      const modulus = 1000000007n;
      const expected = bigintCryptoUtils.modPow(base, exponent, modulus);
      const result = RSAUtils.modPow(base, exponent, modulus);
      expect(result).toBe(expected);
    });

    it('should handle exponent 0 correctly', () => {
      const base = 123n;
      const exponent = 0n;
      const modulus = 100n;
      const expected = 1n; // Any number to the power of 0 is 1
      const result = RSAUtils.modPow(base, exponent, modulus);
      expect(result).toBe(expected);
    });

    it('should handle modulus 1 correctly', () => {
      const base = 123n;
      const exponent = 10n;
      const modulus = 1n;
      const expected = 0n; // Any number mod 1 is 0
      const result = RSAUtils.modPow(base, exponent, modulus);
      expect(result).toBe(expected);
    });
  });

  describe('gcd', () => {
    it('should correctly compute GCD for small values', () => {
      const a = 48n;
      const b = 18n;
      const expected = 6n;
      const result = RSAUtils.gcd(a, b);
      expect(result).toBe(expected);
    });

    it('should correctly compute GCD for large values', () => {
      const a = 123456789n;
      const b = 987654321n;
      const expected = 9n;
      const result = RSAUtils.gcd(a, b);
      expect(result).toBe(expected);
    });

    it('should handle zero correctly', () => {
      const a = 123n;
      const b = 0n;
      const expected = 123n;
      const result = RSAUtils.gcd(a, b);
      expect(result).toBe(expected);
    });

    it('should handle negative numbers correctly', () => {
      const a = -48n;
      const b = 18n;
      const expected = 6n;
      const result = RSAUtils.gcd(a, b);
      expect(result).toBe(expected);
    });
  });

  describe('lcm', () => {
    it('should correctly compute LCM for small values', () => {
      const a = 4n;
      const b = 6n;
      const expected = 12n;
      const result = RSAUtils.lcm(a, b);
      expect(result).toBe(expected);
    });

    it('should correctly compute LCM for large values', () => {
      const a = 123n;
      const b = 456n;
      const expected = 18792n;
      const result = RSAUtils.lcm(a, b);
      expect(result).toBe(expected);
    });

    it('should handle zero correctly', () => {
      const a = 123n;
      const b = 0n;
      const expected = 0n;
      const result = RSAUtils.lcm(a, b);
      expect(result).toBe(expected);
    });
  });

  describe('extendedGcd', () => {
    it('should correctly compute extended GCD for small values', () => {
      const a = 48n;
      const b = 18n;
      const [gcd, x, y] = RSAUtils.extendedGcd(a, b);
      expect(gcd).toBe(6n);
      expect(a * x + b * y).toBe(gcd);
    });

    it('should correctly compute extended GCD for large values', () => {
      const a = 12345n;
      const b = 67890n;
      const [gcd, x, y] = RSAUtils.extendedGcd(a, b);
      expect(a * x + b * y).toBe(gcd);
    });
  });

  describe('modInverse', () => {
    it('should correctly compute modular inverse when it exists', () => {
      const a = 3n;
      const modulus = 7n;
      const expected = 5n; // 3 * 5 mod 7 = 1
      const result = RSAUtils.modInverse(a, modulus);
      expect(result).toBe(expected);
    });

    it('should return null when modular inverse does not exist', () => {
      const a = 2n;
      const modulus = 4n;
      const result = RSAUtils.modInverse(a, modulus);
      expect(result).toBeNull();
    });
  });
});
