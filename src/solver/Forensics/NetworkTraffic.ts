/**
 * Network traffic analysis utilities for CTF challenges
 */

import * as fs from 'fs';

/**
 * Analyze PCAP file for network artifacts
 * @param pcapPath Path to PCAP file
 * @returns Analysis results
 */
const analyzePCAP = (pcapPath: string): {
  basicInfo: {
    size: number;
    packetCount: number;
  };
  artifacts: {
    protocols: string[];
    ipAddresses: {
      source: string[];
      destination: string[];
    };
    ports: {
      source: number[];
      destination: number[];
    };
    httpRequests: {
      method: string;
      path: string;
      host: string;
    }[];
    dnsQueries: {
      name: string;
      type: string;
    }[];
  };
} => {
  if (!fs.existsSync(pcapPath)) {
    throw new Error(`PCAP file not found: ${pcapPath}`);
  }

  const stats = fs.statSync(pcapPath);
  const buffer = fs.readFileSync(pcapPath);

  // Check if it's a valid PCAP file
  if (!isValidPCAP(buffer)) {
    throw new Error('Invalid PCAP file format');
  }

  // Extract basic information
  const packetCount = countPackets(buffer);
  
  // Extract artifacts
  const protocols = extractProtocols(buffer);
  const ipAddresses = extractIPAddresses(buffer);
  const ports = extractPorts(buffer);
  const httpRequests = extractHTTPRequests(buffer);
  const dnsQueries = extractDNSQueries(buffer);

  return {
    basicInfo: {
      size: stats.size,
      packetCount,
    },
    artifacts: {
      protocols,
      ipAddresses,
      ports,
      httpRequests,
      dnsQueries,
    },
  };
};

/**
 * Check if buffer is a valid PCAP file
 * @param buffer Input buffer
 * @returns True if valid PCAP file
 */
const isValidPCAP = (buffer: Buffer): boolean => {
  // Check PCAP magic number (little-endian)
  if (buffer.length < 24) {
    return false;
  }

  const magicNumber = buffer.readUInt32LE(0);
  return magicNumber === 0xA1B2C3D4 || magicNumber === 0xD4C3B2A1;
};

/**
 * Count packets in PCAP file
 * @param buffer Input buffer
 * @returns Number of packets
 */
const countPackets = (buffer: Buffer): number => {
  let count = 0;
  let offset = 24; // Skip PCAP header

  while (offset < buffer.length - 16) {
    // Read packet header
    const packetLength = buffer.readUInt32LE(offset + 8);
    offset += 16 + packetLength;
    count++;
  }

  return count;
};

/**
 * Extract protocols from PCAP file
 * @param buffer Input buffer
 * @returns Array of protocols
 */
const extractProtocols = (buffer: Buffer): string[] => {
  const protocols = new Set<string>();
  let offset = 24; // Skip PCAP header

  while (offset < buffer.length - 16) {
    // Read packet header
    const packetLength = buffer.readUInt32LE(offset + 8);
    const packetData = buffer.slice(offset + 16, offset + 16 + packetLength);

    // Check for Ethernet header
    if (packetData.length >= 14) {
      const etherType = packetData.readUInt16BE(12);
      
      if (etherType === 0x0800) {
        protocols.add('IPv4');
        // Check for TCP/UDP
        if (packetData.length >= 34) {
          const protocol = packetData.readUInt8(23);
          if (protocol === 6) {
            protocols.add('TCP');
          } else if (protocol === 17) {
            protocols.add('UDP');
          } else if (protocol === 1) {
            protocols.add('ICMP');
          }
        }
      } else if (etherType === 0x86DD) {
        protocols.add('IPv6');
      } else if (etherType === 0x0806) {
        protocols.add('ARP');
      }
    }

    offset += 16 + packetLength;
  }

  return Array.from(protocols);
};

/**
 * Extract IP addresses from PCAP file
 * @param buffer Input buffer
 * @returns Source and destination IP addresses
 */
const extractIPAddresses = (buffer: Buffer): {
  source: string[];
  destination: string[];
} => {
  const sourceIPs = new Set<string>();
  const destinationIPs = new Set<string>();
  let offset = 24; // Skip PCAP header

  while (offset < buffer.length - 16) {
    // Read packet header
    const packetLength = buffer.readUInt32LE(offset + 8);
    const packetData = buffer.slice(offset + 16, offset + 16 + packetLength);

    // Check for Ethernet header and IPv4
    if (packetData.length >= 34 && packetData.readUInt16BE(12) === 0x0800) {
      // Extract IPv4 addresses
      const srcIP = `${packetData[26]}.${packetData[27]}.${packetData[28]}.${packetData[29]}`;
      const dstIP = `${packetData[30]}.${packetData[31]}.${packetData[32]}.${packetData[33]}`;
      
      sourceIPs.add(srcIP);
      destinationIPs.add(dstIP);
    }

    offset += 16 + packetLength;
  }

  return {
    source: Array.from(sourceIPs),
    destination: Array.from(destinationIPs),
  };
};

/**
 * Extract ports from PCAP file
 * @param buffer Input buffer
 * @returns Source and destination ports
 */
const extractPorts = (buffer: Buffer): {
  source: number[];
  destination: number[];
} => {
  const sourcePorts = new Set<number>();
  const destinationPorts = new Set<number>();
  let offset = 24; // Skip PCAP header

  while (offset < buffer.length - 16) {
    // Read packet header
    const packetLength = buffer.readUInt32LE(offset + 8);
    const packetData = buffer.slice(offset + 16, offset + 16 + packetLength);

    // Check for Ethernet header, IPv4, and TCP/UDP
    if (packetData.length >= 34 && packetData.readUInt16BE(12) === 0x0800) {
      const protocol = packetData.readUInt8(23);
      
      // TCP or UDP
      if ((protocol === 6 || protocol === 17) && packetData.length >= 38) {
        const srcPort = packetData.readUInt16BE(34);
        const dstPort = packetData.readUInt16BE(36);
        
        sourcePorts.add(srcPort);
        destinationPorts.add(dstPort);
      }
    }

    offset += 16 + packetLength;
  }

  return {
    source: Array.from(sourcePorts),
    destination: Array.from(destinationPorts),
  };
};

/**
 * Extract HTTP requests from PCAP file
 * @param buffer Input buffer
 * @returns Array of HTTP requests
 */
const extractHTTPRequests = (buffer: Buffer): Array<{
  method: string;
  path: string;
  host: string;
}> => {
  const httpRequests: Array<{
    method: string;
    path: string;
    host: string;
  }> = [];
  
  let offset = 24; // Skip PCAP header

  while (offset < buffer.length - 16) {
    // Read packet header
    const packetLength = buffer.readUInt32LE(offset + 8);
    const packetData = buffer.slice(offset + 16, offset + 16 + packetLength);

    // Check for Ethernet header, IPv4, and TCP on port 80
    if (packetData.length >= 42 && packetData.readUInt16BE(12) === 0x0800) {
      const protocol = packetData.readUInt8(23);
      
      if (protocol === 6) {
        const srcPort = packetData.readUInt16BE(34);
        const dstPort = packetData.readUInt16BE(36);
        
        // Check if it's HTTP traffic (port 80 or 8080)
        if (srcPort === 80 || srcPort === 8080 || dstPort === 80 || dstPort === 8080) {
          // Extract TCP payload
          const ipHeaderLength = (packetData[14] & 0x0F) * 4;
          const tcpHeaderLength = ((packetData[14 + ipHeaderLength + 12] & 0xF0) >> 4) * 4;
          const payloadOffset = 14 + ipHeaderLength + tcpHeaderLength;
          
          if (payloadOffset < packetData.length) {
            const payload = packetData.slice(payloadOffset);
            const payloadStr = payload.toString('ascii');
            
            // Check if it's an HTTP request
            if (payloadStr.startsWith('GET ') || payloadStr.startsWith('POST ') || 
                payloadStr.startsWith('PUT ') || payloadStr.startsWith('DELETE ')) {
              const lines = payloadStr.split('\r\n');
              const requestLine = lines[0];
              const [method, path, _] = requestLine.split(' ');
              
              // Extract Host header
              let host = '';
              for (const line of lines) {
                if (line.toLowerCase().startsWith('host: ')) {
                  host = line.substring(6).trim();
                  break;
                }
              }
              
              httpRequests.push({
                method,
                path,
                host,
              });
            }
          }
        }
      }
    }

    offset += 16 + packetLength;
  }

  return httpRequests;
};

/**
 * Extract DNS queries from PCAP file
 * @param buffer Input buffer
 * @returns Array of DNS queries
 */
const extractDNSQueries = (buffer: Buffer): Array<{
  name: string;
  type: string;
}> => {
  const dnsQueries: Array<{
    name: string;
    type: string;
  }> = [];
  
  let offset = 24; // Skip PCAP header

  while (offset < buffer.length - 16) {
    // Read packet header
    const packetLength = buffer.readUInt32LE(offset + 8);
    const packetData = buffer.slice(offset + 16, offset + 16 + packetLength);

    // Check for Ethernet header, IPv4, and UDP on port 53
    if (packetData.length >= 42 && packetData.readUInt16BE(12) === 0x0800) {
      const protocol = packetData.readUInt8(23);
      
      if (protocol === 17) {
        const srcPort = packetData.readUInt16BE(34);
        const dstPort = packetData.readUInt16BE(36);
        
        // Check if it's DNS traffic (port 53)
        if (srcPort === 53 || dstPort === 53) {
          // Extract UDP payload
          const ipHeaderLength = (packetData[14] & 0x0F) * 4;
          const udpHeaderLength = 8;
          const payloadOffset = 14 + ipHeaderLength + udpHeaderLength;
          
          if (payloadOffset < packetData.length) {
            const payload = packetData.slice(payloadOffset);
            
            // Check if it's a DNS query
            if (payload.length >= 12) {
              const flags = payload.readUInt16BE(2);
              const qr = (flags >> 15) & 1;
              
              if (qr === 0) { // Query
                const qdcount = payload.readUInt16BE(4);
                
                if (qdcount > 0) {
                  let qoffset = 12;
                  
                  // Extract query name
                  let nameParts: string[] = [];
                  while (qoffset < payload.length) {
                    const length = payload[qoffset];
                    if (length === 0) {
                      qoffset++;
                      break;
                    }
                    qoffset++;
                    const part = payload.slice(qoffset, qoffset + length).toString('ascii');
                    nameParts.push(part);
                    qoffset += length;
                  }
                  
                  const name = nameParts.join('.');
                  
                  // Extract query type
                  if (qoffset + 2 <= payload.length) {
                    const qtype = payload.readUInt16BE(qoffset);
                    const typeStr = dnsTypeToString(qtype);
                    
                    dnsQueries.push({
                      name,
                      type: typeStr,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }

    offset += 16 + packetLength;
  }

  return dnsQueries;
};

/**
 * Convert DNS type code to string
 * @param type DNS type code
 * @returns DNS type string
 */
const dnsTypeToString = (type: number): string => {
  const typeMap: Record<number, string> = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    6: 'SOA',
    15: 'MX',
    28: 'AAAA',
    33: 'SRV',
    16: 'TXT',
  };
  
  return typeMap[type] || `TYPE${type}`;
};

/**
 * Search for specific pattern in PCAP file
 * @param pcapPath Path to PCAP file
 * @param pattern Pattern to search for
 * @returns Array of packet indices where pattern was found
 */
const searchPatternInPCAP = (pcapPath: string, pattern: string): number[] => {
  if (!fs.existsSync(pcapPath)) {
    throw new Error(`PCAP file not found: ${pcapPath}`);
  }

  const buffer = fs.readFileSync(pcapPath);
  const patternBuffer = Buffer.from(pattern, 'hex');
  const matches: number[] = [];
  
  let offset = 24; // Skip PCAP header
  let packetIndex = 0;

  while (offset < buffer.length - 16) {
    // Read packet header
    const packetLength = buffer.readUInt32LE(offset + 8);
    const packetData = buffer.slice(offset + 16, offset + 16 + packetLength);
    
    // Search for pattern in packet data
    for (let i = 0; i <= packetData.length - patternBuffer.length; i++) {
      let found = true;
      for (let j = 0; j < patternBuffer.length; j++) {
        if (packetData[i + j] !== patternBuffer[j]) {
          found = false;
          break;
        }
      }
      if (found) {
        matches.push(packetIndex);
        break;
      }
    }

    offset += 16 + packetLength;
    packetIndex++;
  }

  return matches;
};

export {
  analyzePCAP,
  searchPatternInPCAP
};
