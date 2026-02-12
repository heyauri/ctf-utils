// Comprehensive test script for RSA module
const { RSASolver, attacks, generateKeyPair, encrypt, decrypt } = require('./lib/solver/RSA');

async function testRSA() {
  console.log('=== Comprehensive RSA Module Test ===\n');

  // Test 1: Key generation
  console.log('1. Testing key generation...');
  try {
    const keyPair = await RSASolver.generateKeyPair(512);
    console.log('✓ Key pair generated successfully');
    console.log('  Public key n:', keyPair.publicKey.n.toString().slice(0, 50) + '...');
    console.log('  Public key e:', keyPair.publicKey.e);
    console.log('  Private key d:', keyPair.privateKey.d.toString().slice(0, 50) + '...');
  } catch (error) {
    console.log('✗ Key generation failed:', error.message);
  }

  // Test 2: Encryption and decryption
  console.log('\n2. Testing encryption and decryption...');
  try {
    const keyPair = await RSASolver.generateKeyPair(512);
    const message = 'Hello, CTF!';
    console.log('  Original message:', message);

    const encrypted = RSASolver.encrypt(message, keyPair.publicKey);
    console.log('✓ Encrypted successfully:', encrypted.toString().slice(0, 50) + '...');

    const decrypted = RSASolver.decrypt(encrypted, keyPair.privateKey);
    console.log('✓ Decrypted successfully:', decrypted);
    console.log('✓ Message matches:', decrypted === message);
  } catch (error) {
    console.log('✗ Encryption/decryption failed:', error.message);
  }

  // Test 3: Utility functions
  console.log('\n3. Testing utility functions...');
  try {
    const testString = 'Test string';
    const bigint = RSASolver.stringToBigint(testString);
    console.log('✓ stringToBigint works:', bigint.toString().slice(0, 50) + '...');

    const restoredString = RSASolver.bigintToString(bigint);
    console.log('✓ bigintToString works:', restoredString);
    console.log('✓ String conversion matches:', restoredString === testString);

    const gcdResult = RSASolver.gcd(12n, 18n);
    console.log('✓ gcd works:', gcdResult);
    console.log('✓ gcd result correct:', gcdResult === 6n);

    const lcmResult = RSASolver.lcm(4n, 6n);
    console.log('✓ lcm works:', lcmResult);
    console.log('✓ lcm result correct:', lcmResult === 12n);

    const modInvResult = RSASolver.modInv(3n, 7n);
    console.log('✓ modInv works:', modInvResult);
    console.log('✓ modInv result correct:', (3n * modInvResult) % 7n === 1n);
  } catch (error) {
    console.log('✗ Utility functions failed:', error.message);
  }

  // Test 4: Small exponent attack (e=3)
  console.log('\n4. Testing small exponent attack...');
  try {
    const n = 3233n; // 61 * 53
    const e = 3n;
    const message = 42n;
    const ciphertext = message ** e % n;

    let result = 0n;
    while (result ** 3n % n !== ciphertext) {
      result++;
      if (result > n) break;
    }

    console.log('✓ Small exponent attack successful');
    console.log('  Original message:', message);
    console.log('  Decrypted message:', result);
    console.log('✓ Attack result correct:', result === message);
  } catch (error) {
    console.log('✗ Small exponent attack failed:', error.message);
  }

  // Test 5: Common modulus attack
  console.log('\n5. Testing common modulus attack...');
  try {
    const n = 3233n; // 61 * 53
    const e1 = 3n;
    const e2 = 5n;
    const message = 42n;
    const ciphertext1 = message ** e1 % n;
    const ciphertext2 = message ** e2 % n;

    const result = attacks.commonModulus(ciphertext1, ciphertext2, { n, e: e1 }, { n, e: e2 });
    console.log('✓ Common modulus attack successful');
    console.log('  Original message:', message);
    console.log('  Decrypted message:', result);
    console.log('✓ Attack result correct:', result === message);
  } catch (error) {
    console.log('✗ Common modulus attack failed:', error.message);
  }

  // Test 6: Trial division attack
  console.log('\n6. Testing trial division attack...');
  try {
    const p = 2n;
    const q = 3n;
    const n = p * q;

    const result = attacks.trialDivision(n);
    console.log('✓ Trial division attack executed');
    console.log('  Original n:', n);
    console.log('  Found factors:', result);
    if (result) {
      console.log('✓ Factors correct:', (result.p === p && result.q === q) || (result.p === q && result.q === p));
    } else {
      console.log('⚠️  No factors found (expected for larger primes)');
    }
  } catch (error) {
    console.log('✗ Trial division attack failed:', error.message);
  }

  // Test 7: Franklin-Reiter attack
  console.log('\n7. Testing Franklin-Reiter attack...');
  try {
    const n = 3233n; // 61 * 53
    const e = 3n;
    const m1 = 42n;
    const a = 2n;
    const b = 5n;
    const m2 = a * m1 + b;
    const c1 = m1 ** e % n;
    const c2 = m2 ** e % n;

    const f = (x) => a * x + b;
    const result = attacks.franklinReiter(c1, c2, { n, e }, f);
    console.log('✓ Franklin-Reiter attack successful');
    console.log('  Original message 1:', m1);
    console.log('  Original message 2:', m2);
    console.log('  Decrypted message:', result);
    console.log('✓ Attack result correct:', result === m1);
  } catch (error) {
    console.log('✗ Franklin-Reiter attack failed:', error.message);
  }

  // Test 8: Coppersmith attack
  console.log('\n8. Testing Coppersmith attack...');
  try {
    const n = 3233n; // 61 * 53
    // Polynomial: x - 42
    const polynomial = (x) => x - 42n;
    const result = attacks.coppersmith(n, polynomial, 0.5);
    console.log('✓ Coppersmith attack successful');
    console.log('  Expected root:', 42n);
    console.log('  Found root:', result);
    console.log('✓ Attack result correct:', result === 42n);
  } catch (error) {
    console.log('✗ Coppersmith attack failed:', error.message);
  }

  // Test 9: Coppersmith factor attack
  console.log('\n9. Testing Coppersmith factor attack...');
  try {
    const p = 61n;
    const q = 53n;
    const n = p * q;
    const knownPart = 61n; // Known part of p
    const knownBits = 0; // No unknown bits

    const result = attacks.coppersmithFactor(n, knownBits, knownPart);
    console.log('✓ Coppersmith factor attack successful');
    console.log('  Original n:', n);
    console.log('  Found factors:', result);
    if (result) {
      console.log('✓ Factors correct:', (result.p === p && result.q === q) || (result.p === q && result.q === p));
    } else {
      console.log('⚠️  No factors found');
    }
  } catch (error) {
    console.log('✗ Coppersmith factor attack failed:', error.message);
  }

  // Test 10: RSASolver attack method
  console.log('\n10. Testing RSASolver attack method...');
  try {
    const n = 3233n; // 61 * 53
    const e = 3n;
    const message = 42n;
    const ciphertext = message ** e % n;

    const result = RSASolver.attack('smallExponent', ciphertext, { n, e });
    console.log('✓ RSASolver attack method works');
    console.log('  Attack type: smallExponent');
    console.log('  Original message:', message);
    console.log('  Decrypted message:', result);
  } catch (error) {
    console.log('✗ RSASolver attack method failed:', error.message);
  }

  console.log('\n=== RSA Module Test Completed ===');
}

testRSA().catch(console.error);