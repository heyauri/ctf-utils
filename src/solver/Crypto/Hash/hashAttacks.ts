/**
 * Hash attack utilities for CTF challenges
 */

import * as crypto from 'crypto';

/**
 * Generate MD5 hash of a string
 * @param input Input string
 * @returns MD5 hash as hex string
 */
const md5 = (input: string): string => {
  return crypto.createHash('md5').update(input).digest('hex');
};

/**
 * Generate SHA1 hash of a string
 * @param input Input string
 * @returns SHA1 hash as hex string
 */
const sha1 = (input: string): string => {
  return crypto.createHash('sha1').update(input).digest('hex');
};

/**
 * Generate SHA256 hash of a string
 * @param input Input string
 * @returns SHA256 hash as hex string
 */
const sha256 = (input: string): string => {
  return crypto.createHash('sha256').update(input).digest('hex');
};

/**
 * Generate SHA512 hash of a string
 * @param input Input string
 * @returns SHA512 hash as hex string
 */
const sha512 = (input: string): string => {
  return crypto.createHash('sha512').update(input).digest('hex');
};

/**
 * Generate SHA384 hash of a string
 * @param input Input string
 * @returns SHA384 hash as hex string
 */
const sha384 = (input: string): string => {
  return crypto.createHash('sha384').update(input).digest('hex');
};

/**
 * Generate RIPEMD-160 hash of a string
 * @param input Input string
 * @returns RIPEMD-160 hash as hex string
 */
const ripemd160 = (input: string): string => {
  return crypto.createHash('ripemd160').update(input).digest('hex');
};

/**
 * Brute force hash cracking
 * @param hash Target hash
 * @param charset Character set to use for brute force
 * @param maxLength Maximum length of strings to try
 * @param algorithm Hash algorithm to use
 * @returns Found plaintext or null if not found
 */
const bruteForceHash = (hash: string, charset: string, maxLength: number, algorithm: string = 'md5'): string | null => {
  // Use iterative approach instead of recursive for better performance
  // This avoids stack overflow for large maxLength and is generally faster
  
  // Start with empty string
  const queue = [''];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    // Check current string
    const currentHash = crypto.createHash(algorithm).update(current).digest('hex');
    if (currentHash === hash) {
      return current;
    }
    
    // Generate next strings if we haven't reached max length
    if (current.length < maxLength) {
      for (const char of charset) {
        queue.push(current + char);
      }
    }
  }
  
  return null;
};

/**
 * Dictionary attack on hash
 * @param hash Target hash
 * @param dictionaryPath Path to dictionary file
 * @param algorithm Hash algorithm to use
 * @returns Found plaintext or null if not found
 */
const dictionaryAttack = (hash: string, dictionaryPath: string, algorithm: string = 'md5'): string | null => {
  try {
    const fs = require('fs');
    const dictionary = fs.readFileSync(dictionaryPath, 'utf8').split('\n');

    for (const word of dictionary) {
      const trimmedWord = word.trim();
      if (trimmedWord) {
        const currentHash = crypto.createHash(algorithm).update(trimmedWord).digest('hex');
        if (currentHash === hash) {
          return trimmedWord;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error reading dictionary file:', error);
    return null;
  }
};

/**
 * Rainbow table attack on hash
 * @param hash Target hash
 * @param rainbowTablePath Path to rainbow table file
 * @param algorithm Hash algorithm to use
 * @returns Found plaintext or null if not found
 */
const rainbowTableAttack = (hash: string, rainbowTablePath: string, algorithm: string = 'md5'): string | null => {
  try {
    const fs = require('fs');
    const rainbowTable = fs.readFileSync(rainbowTablePath, 'utf8').split('\n');

    for (const entry of rainbowTable) {
      const [plaintext, entryHash] = entry.split(':');
      if (entryHash === hash) {
        return plaintext;
      }
    }

    return null;
  } catch (error) {
    console.error('Error reading rainbow table file:', error);
    return null;
  }
};

/**
 * Generate rainbow table
 * @param charset Character set to use
 * @param minLength Minimum length of strings
 * @param maxLength Maximum length of strings
 * @param outputPath Path to output rainbow table file
 * @param algorithm Hash algorithm to use
 */
const generateRainbowTable = (charset: string, minLength: number, maxLength: number, outputPath: string, algorithm: string = 'md5'): void => {
  try {
    const fs = require('fs');
    const writeStream = fs.createWriteStream(outputPath);

    /**
     * Recursive function to generate all possible strings
     */
    const generate = (prefix: string, length: number): void => {
      if (length > maxLength) {
        return;
      }

      if (length >= minLength) {
        const hash = crypto.createHash(algorithm).update(prefix).digest('hex');
        writeStream.write(`${prefix}:${hash}\n`);
      }

      for (const char of charset) {
        generate(prefix + char, length + 1);
      }
    };

    generate('', 0);
    writeStream.end();
    console.log(`Rainbow table generated successfully at ${outputPath}`);
  } catch (error) {
    console.error('Error generating rainbow table:', error);
  }
};

/**
 * Check for hash collision
 * @param algorithm Hash algorithm to use
 * @param maxAttempts Maximum number of attempts
 * @returns Collision information or null if no collision found
 */
const findHashCollision = (algorithm: string = 'md5', maxAttempts: number = 1000000): { input1: string; input2: string; hash: string } | null => {
  const hashMap = new Map<string, string>();

  for (let i = 0; i < maxAttempts; i++) {
    const randomBytes = crypto.randomBytes(8);
    const input = randomBytes.toString('hex');
    const hash = crypto.createHash(algorithm).update(input).digest('hex');

    if (hashMap.has(hash)) {
      return {
        input1: hashMap.get(hash)!,
        input2: input,
        hash
      };
    }

    hashMap.set(hash, input);
  }

  return null;
};

/**
 * Generate hash with specified prefix
 * @param prefix Target prefix
 * @param length Length of hash to generate
 * @param algorithm Hash algorithm to use
 * @returns Input that generates hash with specified prefix
 */
const generateHashWithPrefix = (prefix: string, length: number = 4, algorithm: string = 'md5'): string => {
  let input = 0;
  const targetPrefix = prefix.toLowerCase();

  while (true) {
    const inputStr = input.toString();
    const hash = crypto.createHash(algorithm).update(inputStr).digest('hex');
    
    if (hash.substring(0, length) === targetPrefix) {
      return inputStr;
    }

    input++;
  }
};

/**
 * Analyze hash type based on length and pattern
 * @param hash Hash string
 * @returns Possible hash algorithms
 */
const analyzeHashType = (hash: string): string[] => {
  const possibleAlgorithms: string[] = [];
  const hashLength = hash.length;

  // Check for common hash lengths
  switch (hashLength) {
    case 32:
      possibleAlgorithms.push('MD5');
      break;
    case 40:
      possibleAlgorithms.push('SHA1');
      break;
    case 64:
      possibleAlgorithms.push('SHA256');
      break;
    case 96:
      possibleAlgorithms.push('SHA384');
      break;
    case 128:
      possibleAlgorithms.push('SHA512');
      break;
    case 48:
      possibleAlgorithms.push('NTLM');
      break;
    case 16:
      possibleAlgorithms.push('CRC32');
      break;
    case 20:
      possibleAlgorithms.push('RIPEMD-160');
      break;
  }

  // Check if it's a hex string
  const hexPattern = /^[0-9a-fA-F]+$/;
  if (!hexPattern.test(hash)) {
    possibleAlgorithms.push('Non-hex hash (e.g., base64 encoded)');
  }

  return possibleAlgorithms.length > 0 ? possibleAlgorithms : ['Unknown'];
};

/**
 * Perform hash length extension attack
 * @param originalHash Original hash
 * @param originalData Original data
 * @param appendData Data to append
 * @param keyLength Length of the secret key
 * @param algorithm Hash algorithm to use
 * @returns Extended hash and combined data
 */
const hashLengthExtensionAttack = (originalHash: string, originalData: string, appendData: string, keyLength: number, algorithm: string = 'sha1'): { extendedHash: string; combinedData: Buffer } => {
  // This is a simplified implementation for demonstration purposes
  // In a real implementation, you would need to handle the internal state manipulation
  // of the hash function

  // For demonstration, we'll just return a placeholder
  // Note: A proper implementation would require low-level manipulation of the hash function's state
  const combinedData = Buffer.concat([
    Buffer.from('A'.repeat(keyLength)), // Simulated key
    Buffer.from(originalData),
    Buffer.from('\x80' + '\x00'.repeat((64 - (keyLength + originalData.length + 1) % 64) % 64)), // Padding
    Buffer.from([0, 0, 0, 0, 0, 0, 0, (keyLength + originalData.length) * 8]), // Length
    Buffer.from(appendData)
  ]);

  const extendedHash = crypto.createHash(algorithm).update(combinedData).digest('hex');

  return {
    extendedHash,
    combinedData
  };
};

/**
 * Generate hash with salt
 * @param input Input string
 * @param salt Salt to use
 * @param algorithm Hash algorithm to use
 * @returns Hash as hex string
 */
const hashWithSalt = (input: string, salt: string, algorithm: string = 'sha256'): string => {
  return crypto.createHash(algorithm).update(input + salt).digest('hex');
};

/**
 * Brute force hash with salt
 * @param hash Target hash
 * @param salt Salt used
 * @param charset Character set to use
 * @param maxLength Maximum length of strings to try
 * @param algorithm Hash algorithm to use
 * @returns Found plaintext or null if not found
 */
const bruteForceHashWithSalt = (hash: string, salt: string, charset: string, maxLength: number, algorithm: string = 'sha256'): string | null => {
  const queue = [''];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentHash = crypto.createHash(algorithm).update(current + salt).digest('hex');
    
    if (currentHash === hash) {
      return current;
    }
    
    if (current.length < maxLength) {
      for (const char of charset) {
        queue.push(current + char);
      }
    }
  }
  
  return null;
};

/**
 * Dictionary attack on hash with salt
 * @param hash Target hash
 * @param salt Salt used
 * @param dictionaryPath Path to dictionary file
 * @param algorithm Hash algorithm to use
 * @returns Found plaintext or null if not found
 */
const dictionaryAttackWithSalt = (hash: string, salt: string, dictionaryPath: string, algorithm: string = 'sha256'): string | null => {
  try {
    const fs = require('fs');
    const dictionary = fs.readFileSync(dictionaryPath, 'utf8').split('\n');

    for (const word of dictionary) {
      const trimmedWord = word.trim();
      if (trimmedWord) {
        const currentHash = crypto.createHash(algorithm).update(trimmedWord + salt).digest('hex');
        if (currentHash === hash) {
          return trimmedWord;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error reading dictionary file:', error);
    return null;
  }
};

/**
 * Generate HMAC
 * @param key Secret key
 * @param data Data to authenticate
 * @param algorithm Hash algorithm to use
 * @returns HMAC as hex string
 */
const generateHMAC = (key: string, data: string, algorithm: string = 'sha256'): string => {
  return crypto.createHmac(algorithm, key).update(data).digest('hex');
};

/**
 * Crack HMAC using brute force
 * @param hmac Target HMAC
 * @param data Data that was authenticated
 * @param charset Character set to use
 * @param maxLength Maximum length of key to try
 * @param algorithm Hash algorithm to use
 * @returns Found key or null if not found
 */
const crackHMAC = (hmac: string, data: string, charset: string, maxLength: number, algorithm: string = 'sha256'): string | null => {
  const queue = [''];
  
  while (queue.length > 0) {
    const currentKey = queue.shift()!;
    const currentHMAC = crypto.createHmac(algorithm, currentKey).update(data).digest('hex');
    
    if (currentHMAC === hmac) {
      return currentKey;
    }
    
    if (currentKey.length < maxLength) {
      for (const char of charset) {
        queue.push(currentKey + char);
      }
    }
  }
  
  return null;
};

export {
  md5,
  sha1,
  sha256,
  sha384,
  sha512,
  ripemd160,
  bruteForceHash,
  dictionaryAttack,
  rainbowTableAttack,
  generateRainbowTable,
  findHashCollision,
  generateHashWithPrefix,
  analyzeHashType,
  hashLengthExtensionAttack,
  hashWithSalt,
  bruteForceHashWithSalt,
  dictionaryAttackWithSalt,
  generateHMAC,
  crackHMAC
};