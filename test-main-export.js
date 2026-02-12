// Test script to verify RSA module is accessible from main export
const { solver } = require('./lib');

async function testMainExport() {
  console.log('=== Testing Main Export Access ===\n');

  // Test 1: Check if RSA module is accessible
  console.log('1. Testing RSA module access...');
  try {
    if (solver && solver.RSA) {
      console.log('✓ RSA module is accessible via solver.RSA');
      console.log('✓ RSASolver class exists:', typeof solver.RSA.RSASolver === 'function');
      console.log('✓ attacks object exists:', typeof solver.RSA.attacks === 'object');
      console.log('✓ Utility functions exist:', typeof solver.RSA.stringToBigint === 'function');
    } else {
      console.log('✗ RSA module is not accessible');
    }
  } catch (error) {
    console.log('✗ Error accessing RSA module:', error.message);
  }

  // Test 2: Test key generation via main export
  console.log('\n2. Testing key generation via main export...');
  try {
    const keyPair = await solver.RSA.RSASolver.generateKeyPair(512);
    console.log('✓ Key pair generated successfully');
    console.log('  Public key n length:', keyPair.publicKey.n.toString().length, 'digits');
    console.log('  Public key e:', keyPair.publicKey.e);
  } catch (error) {
    console.log('✗ Key generation failed:', error.message);
  }

  // Test 3: Test encryption/decryption via main export
  console.log('\n3. Testing encryption/decryption via main export...');
  try {
    const keyPair = await solver.RSA.RSASolver.generateKeyPair(512);
    const message = 'Hello from main export!';
    console.log('  Original message:', message);

    const encrypted = solver.RSA.RSASolver.encrypt(message, keyPair.publicKey);
    console.log('✓ Encrypted successfully');

    const decrypted = solver.RSA.RSASolver.decrypt(encrypted, keyPair.privateKey);
    console.log('✓ Decrypted successfully:', decrypted);
    console.log('✓ Message matches:', decrypted === message);
  } catch (error) {
    console.log('✗ Encryption/decryption failed:', error.message);
  }

  // Test 4: Test utility functions via main export
  console.log('\n4. Testing utility functions via main export...');
  try {
    const testString = 'Test from main';
    const bigint = solver.RSA.RSASolver.stringToBigint(testString);
    console.log('✓ stringToBigint works');

    const restoredString = solver.RSA.RSASolver.bigintToString(bigint);
    console.log('✓ bigintToString works:', restoredString);
    console.log('✓ String conversion matches:', restoredString === testString);
  } catch (error) {
    console.log('✗ Utility functions failed:', error.message);
  }

  // Test 5: Test key strength evaluation
  console.log('\n5. Testing key strength evaluation...');
  try {
    const keyPair = await solver.RSA.RSASolver.generateKeyPair(1024);
    const strength = solver.RSA.RSASolver.evaluateKeyStrength(keyPair.publicKey.n);
    console.log('✓ Key strength evaluation works');
    console.log('  Key size:', strength.keySize, 'bits');
    console.log('  Strength rating:', strength.strength);
  } catch (error) {
    console.log('✗ Key strength evaluation failed:', error.message);
  }

  console.log('\n=== Main Export Test Completed ===');
}

testMainExport().catch(console.error);