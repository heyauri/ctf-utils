import * as fs from 'fs';
import * as path from 'path';

export interface PDFInfo {
  version: string;
  pageCount: number;
  encrypted: boolean;
  metadata: Record<string, string>;
  objects: number;
  streams: number;
}

export interface PDFStegoResult {
  hasHiddenData: boolean;
  method: string;
  data: Buffer | null;
}

export interface PDFObject {
  id: number;
  generation: number;
  type: string;
  content: string;
}

export class PDFAnalyzer {
  static analyze(filePath: string): PDFInfo | null {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      const versionMatch = content.match(/%PDF-(\d+\.\d+)/);
      const version = versionMatch ? versionMatch[1] : 'Unknown';
      
      const pageCount = (content.match(/\/Type\s*\/Page[^s]/g) || []).length;
      
      const encrypted = content.includes('/Encrypt');
      
      const metadata: Record<string, string> = {};
      const creatorMatch = content.match(/\/Creator\s*\(([^)]*)\)/);
      if (creatorMatch) metadata.creator = creatorMatch[1];
      const producerMatch = content.match(/\/Producer\s*\(([^)]*)\)/);
      if (producerMatch) metadata.producer = producerMatch[1];
      const titleMatch = content.match(/\/Title\s*\(([^)]*)\)/);
      if (titleMatch) metadata.title = titleMatch[1];
      
      const objectCount = (content.match(/\d+\s+\d+\s+obj/g) || []).length;
      const streamCount = (content.match(/stream/g) || []).length;
      
      return {
        version,
        pageCount,
        encrypted,
        metadata,
        objects: objectCount,
        streams: streamCount
      };
    } catch {
      return null;
    }
  }
  
  static extractStrings(filePath: string, minLength: number = 4): string[] {
    try {
      const content = fs.readFileSync(filePath, 'latin1');
      const strings: string[] = [];
      let current = '';
      
      for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        if (char >= 32 && char <= 126) {
          current += content[i];
        } else {
          if (current.length >= minLength) {
            strings.push(current);
          }
          current = '';
        }
      }
      
      if (current.length >= minLength) {
        strings.push(current);
      }
      
      return strings;
    } catch {
      return [];
    }
  }
  
  static detectHiddenData(filePath: string): PDFStegoResult {
    try {
      const content = fs.readFileSync(filePath, 'latin1');
      
      const suspicious = [
        /\/AA\s*<</,
        /\/OpenAction\s*<</,
        /\/JS\s*<</,
        /\/JavaScript\s*<</,
        /\/URI\s*\(http/,
        /\/Launch/,
        /\/SubmitForm/,
        /\/ImportData/,
        /\/AA.*\/S\/GoTo/,
        /\/RichMedia/
      ];
      
      for (const pattern of suspicious) {
        if (pattern.test(content)) {
          return {
            hasHiddenData: true,
            method: 'Suspicious Action',
            data: null
          };
        }
      }
      
      const hiddenPatterns = [
        /\x00\x00\x00/,
        /\xfe\xff/,
        /\xff\xfe/
      ];
      
      for (const pattern of hiddenPatterns) {
        if (pattern.test(content)) {
          return {
            hasHiddenData: true,
            method: 'Hidden Bytes',
            data: null
          };
        }
      }
      
      const streams = content.match(/stream[\s\S]*?endstream/g);
      if (streams) {
        for (const stream of streams) {
          if (stream.length > 10000 && !stream.includes('/Filter')) {
            return {
              hasHiddenData: true,
              method: 'Unfiltered Stream',
              data: null
            };
          }
        }
      }
      
      return {
        hasHiddenData: false,
        method: 'None',
        data: null
      };
    } catch {
      return {
        hasHiddenData: false,
        method: 'Error',
        data: null
      };
    }
  }
  
  static extractStreams(filePath: string): string[] {
    try {
      const content = fs.readFileSync(filePath, 'latin1');
      const streams: string[] = [];
      const regex = /stream\s*([\s\S]*?)endsream/g;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        streams.push(match[1].trim());
      }
      
      return streams;
    } catch {
      return [];
    }
  }
  
  static extractImages(filePath: string): Buffer[] {
    try {
      const content = fs.readFileSync(filePath);
      const images: Buffer[] = [];
      
      const jpegPattern = /\xff\xd8[\s\S]*?\xff\xd9/g;
      const jpegMatches = content.toString('latin1').match(jpegPattern);
      if (jpegMatches) {
        for (const match of jpegMatches) {
          images.push(Buffer.from(match, 'latin1'));
        }
      }
      
      const pngPattern = /\x89PNG[\s\S]*?IEND\xaeB`\x82/g;
      const pngMatches = content.toString('latin1').match(pngPattern);
      if (pngMatches) {
        for (const match of pngMatches) {
          images.push(Buffer.from(match, 'latin1'));
        }
      }
      
      return images;
    } catch {
      return [];
    }
  }
  
  static findHiddenLayers(filePath: string): string[] {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const layers: string[] = [];
      
      const ocPattern = /\/OCProperties\s*<<[\s\S]*?\/OCGs\s*\[\s*([\s\S]*?)\s*\]/g;
      let match;
      
      while ((match = ocPattern.exec(content)) !== null) {
        const ocgs = match[1].match(/\/(\w+)/g);
        if (ocgs) {
          layers.push(...ocgs.map(s => s.substring(1)));
        }
      }
      
      return layers;
    } catch {
      return [];
    }
  }
  
  static checkForXSS(filePath: string): boolean {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const xssPatterns = [
        /javascript:/i,
        /vbscript:/i,
        /data:text\/html/i,
        /<script/i,
        /on\w+\s*=/i
      ];
      
      for (const pattern of xssPatterns) {
        if (pattern.test(content)) {
          return true;
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }
}

export default PDFAnalyzer;
