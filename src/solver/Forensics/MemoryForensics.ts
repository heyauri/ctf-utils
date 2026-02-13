/**
 * Memory forensics utilities for CTF challenges
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Analyze memory dump file for artifacts
 * @param dumpPath Path to memory dump file
 * @returns Analysis results
 */
const analyzeMemoryDump = (dumpPath: string): {
  basicInfo: {
    size: number;
    fileType: string;
  };
  artifacts: {
    strings: string[];
    possiblePasswords: string[];
    possibleIPs: string[];
    possibleURLs: string[];
    possibleHashes: { type: string; value: string }[];
    possibleEncryptionKeys: string[];
    possibleProcesses: string[];
    possibleNetworkConnections: string[];
    possibleRegistryKeys: string[];
    possibleFilePaths: string[];
  };
} => {
  if (!fs.existsSync(dumpPath)) {
    throw new Error(`Memory dump file not found: ${dumpPath}`);
  }

  const stats = fs.statSync(dumpPath);
  const buffer = fs.readFileSync(dumpPath);

  // Extract strings (ASCII and Unicode)
  const strings = extractStrings(buffer);
  
  // Extract possible passwords
  const possiblePasswords = identifyPasswords(strings);
  
  // Extract possible IP addresses
  const possibleIPs = identifyIPs(strings);
  
  // Extract possible URLs
  const possibleURLs = identifyURLs(strings);
  
  // Extract possible hash values
  const possibleHashes = identifyHashes(strings);
  
  // Extract possible encryption keys
  const possibleEncryptionKeys = identifyEncryptionKeys(strings);
  
  // Extract possible process information
  const possibleProcesses = identifyProcesses(strings);
  
  // Extract possible network connection information
  const possibleNetworkConnections = identifyNetworkConnections(strings);
  
  // Extract possible registry keys (Windows)
  const possibleRegistryKeys = identifyRegistryKeys(strings);
  
  // Extract possible file paths
  const possibleFilePaths = identifyFilePaths(strings);

  return {
    basicInfo: {
      size: stats.size,
      fileType: identifyDumpType(buffer),
    },
    artifacts: {
      strings,
      possiblePasswords,
      possibleIPs,
      possibleURLs,
      possibleHashes,
      possibleEncryptionKeys,
      possibleProcesses,
      possibleNetworkConnections,
      possibleRegistryKeys,
      possibleFilePaths,
    },
  };
};

/**
 * Extract printable strings from buffer
 * @param buffer Input buffer
 * @param minLength Minimum string length to extract
 * @returns Array of extracted strings
 */
const extractStrings = (buffer: Buffer, minLength: number = 4): string[] => {
  const strings: string[] = [];
  let currentString = '';

  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    
    // Check if byte is printable ASCII
    if (byte >= 0x20 && byte <= 0x7E) {
      currentString += String.fromCharCode(byte);
    } else {
      if (currentString.length >= minLength) {
        strings.push(currentString);
      }
      currentString = '';
    }
  }

  // Check if last string is valid
  if (currentString.length >= minLength) {
    strings.push(currentString);
  }

  return strings;
};

/**
 * Identify possible passwords from strings
 * @param strings Array of strings
 * @returns Array of possible passwords
 */
const identifyPasswords = (strings: string[]): string[] => {
  const passwordPatterns = [
    /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
    /^[A-Z][a-z]+[0-9]+[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
    /^pass(word)?[0-9]+$/i,
    /^[0-9]{4,}$/,
  ];

  return strings.filter(str => 
    passwordPatterns.some(pattern => pattern.test(str))
  );
};

/**
 * Identify IP addresses from strings
 * @param strings Array of strings
 * @returns Array of possible IP addresses
 */
const identifyIPs = (strings: string[]): string[] => {
  const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const ips = new Set<string>();

  strings.forEach(str => {
    const matches = str.match(ipPattern);
    if (matches) {
      matches.forEach(match => ips.add(match));
    }
  });

  return Array.from(ips);
};

/**
 * Identify URLs from strings
 * @param strings Array of strings
 * @returns Array of possible URLs
 */
const identifyURLs = (strings: string[]): string[] => {
  const urlPattern = /https?:\/\/[\w\-_~:/?#[\]@!$&'()*+,;=.]+/g;
  const urls = new Set<string>();

  strings.forEach(str => {
    const matches = str.match(urlPattern);
    if (matches) {
      matches.forEach(match => urls.add(match));
    }
  });

  return Array.from(urls);
};

/**
 * Identify hash values from strings
 * @param strings Array of strings
 * @returns Array of possible hash values
 */
const identifyHashes = (strings: string[]): { type: string; value: string }[] => {
  const hashPatterns = [
    { pattern: /^[0-9a-f]{32}$/i, type: 'MD5' },
    { pattern: /^[0-9a-f]{40}$/i, type: 'SHA1' },
    { pattern: /^[0-9a-f]{64}$/i, type: 'SHA256' },
    { pattern: /^[0-9a-f]{128}$/i, type: 'SHA512' },
    { pattern: /^[0-9a-f]{48}$/i, type: 'SHA384' },
    { pattern: /^[0-9a-f]{56}$/i, type: 'SHA224' },
    { pattern: /^[0-9a-f]{32}$/i, type: 'MD4' },
    { pattern: /^[0-9a-f]{20}$/i, type: 'RIPEMD-160' },
  ];

  const hashes: { type: string; value: string }[] = [];

  strings.forEach(str => {
    hashPatterns.forEach(({ pattern, type }) => {
      if (pattern.test(str)) {
        hashes.push({ type, value: str });
      }
    });
  });

  return hashes;
};

/**
 * Identify possible encryption keys from strings
 * @param strings Array of strings
 * @returns Array of possible encryption keys
 */
const identifyEncryptionKeys = (strings: string[]): string[] => {
  const keyPatterns = [
    /^[0-9a-f]{16}$/i, // 128-bit hex key
    /^[0-9a-f]{24}$/i, // 192-bit hex key
    /^[0-9a-f]{32}$/i, // 256-bit hex key
    /^[A-Za-z0-9+/]{24}$/, // Base64 128-bit key
    /^[A-Za-z0-9+/]{32}$/, // Base64 192-bit key
    /^[A-Za-z0-9+/]{44}$/, // Base64 256-bit key
    /^[A-Za-z0-9]{16,}$/, // Alphanumeric key
  ];

  return strings.filter(str => 
    keyPatterns.some(pattern => pattern.test(str))
  );
};

/**
 * Identify process information from strings
 * @param strings Array of strings
 * @returns Array of possible process information
 */
const identifyProcesses = (strings: string[]): string[] => {
  const processPatterns = [
    /^[A-Za-z0-9_]+\.exe$/i,
    /^[A-Za-z0-9_]+\.dll$/i,
    /^[A-Za-z0-9_]+\.so$/i,
    /^[A-Za-z0-9_]+\.dylib$/i,
    /^\/bin\/[A-Za-z0-9_]+$/i,
    /^\/usr\/bin\/[A-Za-z0-9_]+$/i,
    /^\/usr\/sbin\/[A-Za-z0-9_]+$/i,
  ];

  return strings.filter(str => 
    processPatterns.some(pattern => pattern.test(str))
  );
};

/**
 * Identify network connection information from strings
 * @param strings Array of strings
 * @returns Array of possible network connection information
 */
const identifyNetworkConnections = (strings: string[]): string[] => {
  const networkPatterns = [
    /\b(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}\b/g,
    /\b[A-Za-z0-9\-]+\.[A-Za-z]{2,}:\d{1,5}\b/g,
    /\bTCP\b.*\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    /\bUDP\b.*\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  ];

  const connections = new Set<string>();

  strings.forEach(str => {
    networkPatterns.forEach(pattern => {
      const matches = str.match(pattern);
      if (matches) {
        matches.forEach(match => connections.add(match));
      }
    });
  });

  return Array.from(connections);
};

/**
 * Identify registry keys from strings (Windows memory dumps)
 * @param strings Array of strings
 * @returns Array of possible registry keys
 */
const identifyRegistryKeys = (strings: string[]): string[] => {
  const registryPatterns = [
    /^HKEY_LOCAL_MACHINE\\[A-Za-z0-9_\\]+$/i,
    /^HKEY_CURRENT_USER\\[A-Za-z0-9_\\]+$/i,
    /^HKEY_CLASSES_ROOT\\[A-Za-z0-9_\\]+$/i,
    /^HKEY_USERS\\[A-Za-z0-9_\\]+$/i,
    /^HKEY_CURRENT_CONFIG\\[A-Za-z0-9_\\]+$/i,
  ];

  return strings.filter(str => 
    registryPatterns.some(pattern => pattern.test(str))
  );
};

/**
 * Identify file paths from strings
 * @param strings Array of strings
 * @returns Array of possible file paths
 */
const identifyFilePaths = (strings: string[]): string[] => {
  const pathPatterns = [
    /^[A-Z]:\\[A-Za-z0-9_\\.]+$/i, // Windows absolute path
    /^\/[A-Za-z0-9_\/\.]+$/i, // Unix/Linux absolute path
    /^~\/[A-Za-z0-9_\/\.]+$/i, // Home directory path
  ];

  return strings.filter(str => 
    pathPatterns.some(pattern => pattern.test(str))
  );
};

/**
 * Identify memory dump file type
 * @param buffer Input buffer
 * @returns Dump type
 */
const identifyDumpType = (buffer: Buffer): string => {
  // Check for common memory dump headers
  const signatures = [
    { signature: Buffer.from('PAGE', 'ascii'), type: 'Windows Crash Dump' },
    { signature: Buffer.from('ELF', 'ascii'), type: 'Linux Memory Dump' },
    { signature: Buffer.from('Mach-O', 'ascii'), type: 'macOS Memory Dump' },
    { signature: Buffer.from('VMCORE', 'ascii'), type: 'Linux Kernel Crash Dump' },
  ];

  for (const { signature, type } of signatures) {
    if (buffer.includes(signature)) {
      return type;
    }
  }

  return 'Unknown Dump Type';
};

/**
 * Search for specific pattern in memory dump
 * @param dumpPath Path to memory dump file
 * @param pattern Pattern to search for
 * @returns Array of offsets where pattern was found
 */
const searchPattern = (dumpPath: string, pattern: string): number[] => {
  if (!fs.existsSync(dumpPath)) {
    throw new Error(`Memory dump file not found: ${dumpPath}`);
  }

  const buffer = fs.readFileSync(dumpPath);
  const patternBuffer = Buffer.from(pattern, 'hex');
  const offsets: number[] = [];

  for (let i = 0; i <= buffer.length - patternBuffer.length; i++) {
    let match = true;
    for (let j = 0; j < patternBuffer.length; j++) {
      if (buffer[i + j] !== patternBuffer[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      offsets.push(i);
    }
  }

  return offsets;
};

export {
  analyzeMemoryDump,
  extractStrings,
  searchPattern
};
