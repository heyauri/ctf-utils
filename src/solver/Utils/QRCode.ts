import * as fs from 'fs';

export interface QRCodeInfo {
  data: string;
  version: number;
  errorCorrection: string;
  maskPattern: number;
  mode: string;
}

export interface QRCodeResult {
  success: boolean;
  data: string;
  info?: QRCodeInfo;
  error?: string;
}

export class QRCodeTool {
  static parse(filePath: string): QRCodeResult {
    try {
      const content = fs.readFileSync(filePath);
      
      const qrPattern = /\x00\x00\x00\x21\x46\x51\x0d\x0a[\s\S]{4}[\x00-\xff]+/g;
      const matches = content.toString('latin1').match(qrPattern);
      
      if (matches && matches.length > 0) {
        return {
          success: true,
          data: 'QR Code data found in file',
          info: {
            data: 'Embedded QR',
            version: 0,
            errorCorrection: 'Unknown',
            maskPattern: -1,
            mode: 'Unknown'
          }
        };
      }
      
      const str = content.toString('utf-8');
      const urlPattern = /https?:\/\/[^\s]+/g;
      const urls = str.match(urlPattern);
      
      if (urls && urls.length > 0) {
        return {
          success: true,
          data: urls[0],
          info: {
            data: urls[0],
            version: 0,
            errorCorrection: 'Unknown',
            maskPattern: -1,
            mode: 'URL'
          }
        };
      }
      
      const base64Pattern = /[A-Za-z0-9+/]{20,}={0,2}/g;
      const base64s = str.match(base64Pattern);
      
      if (base64s && base64s.length > 0) {
        return {
          success: true,
          data: base64s[0],
          info: {
            data: base64s[0],
            version: 0,
            errorCorrection: 'Unknown',
            maskPattern: -1,
            mode: 'Base64'
          }
        };
      }
      
      return {
        success: false,
        data: '',
        error: 'No QR code or encoded data found'
      };
    } catch (e) {
      return {
        success: false,
        data: '',
        error: `Error reading file: ${e}`
      };
    }
  }
  
  static extractFromImage(filePath: string): QRCodeResult {
    try {
      const content = fs.readFileSync(filePath);
      const hex = content.toString('hex').toLowerCase();
      
      const qrFinderPattern = /0016(?:0[0-7]|[cd])[0-9a-f]{4}0010(?:51|47|48|49)/g;
      const matches = hex.match(qrFinderPattern);
      
      if (matches && matches.length > 0) {
        return {
          success: true,
          data: 'Potential QR code data found',
          info: {
            data: 'Embedded in image',
            version: 0,
            errorCorrection: 'Unknown',
            maskPattern: -1,
            mode: 'Image'
          }
        };
      }
      
      const str = content.toString('utf-8');
      if (str.includes('QR') || str.includes('qr')) {
        return {
          success: true,
          data: 'QR signature detected',
          info: {
            data: 'QR signature',
            version: 0,
            errorCorrection: 'Unknown',
            maskPattern: -1,
            mode: 'Signature'
          }
        };
      }
      
      return {
        success: false,
        data: '',
        error: 'No QR code data found in image'
      };
    } catch (e) {
      return {
        success: false,
        data: '',
        error: `Error: ${e}`
      };
    }
  }
  
  static analyze(filePath: string): QRCodeInfo | null {
    try {
      const content = fs.readFileSync(filePath);
      const hex = content.toString('hex');
      
      let version = 0;
      const versionPattern = /(?:0{8}(?:0[0-7]|1[0-7])|20[0-3][0-9a-f])/g;
      const versionMatches = hex.match(versionPattern);
      if (versionMatches && versionMatches.length > 0) {
        version = versionMatches.length;
      }
      
      const errorCorrectionLevels: Record<string, string> = {
        '00': 'L',
        '01': 'M',
        '10': 'Q',
        '11': 'H'
      };
      const ecPattern = /[02-7][0-9a-f](?:00|08|18|10)/g;
      const ecMatches = hex.match(ecPattern);
      let errorCorrection = 'Unknown';
      if (ecMatches && ecMatches.length > 0) {
        const ec = ecMatches[0].slice(-2);
        errorCorrection = errorCorrectionLevels[ec] || 'Unknown';
      }
      
      return {
        data: 'Analyzed',
        version,
        errorCorrection,
        maskPattern: -1,
        mode: 'Binary'
      };
    } catch {
      return null;
    }
  }
  
  static detectStego(filePath: string): { hasStego: boolean; method: string } {
    try {
      const content = fs.readFileSync(filePath);
      
      const anomalies = 0;
      const lsbAnalysis = Buffer.alloc(content.length);
      for (let i = 0; i < Math.min(1000, content.length); i++) {
        lsbAnalysis[i] = content[i] & 1;
      }
      
      let zeroCount = 0;
      let oneCount = 0;
      for (let i = 0; i < lsbAnalysis.length; i++) {
        if (lsbAnalysis[i] === 0) zeroCount++;
        else oneCount++;
      }
      
      const ratio = Math.abs(zeroCount - oneCount) / lsbAnalysis.length;
      
      if (ratio < 0.01) {
        return {
          hasStego: true,
          method: 'Unusual LSB distribution'
        };
      }
      
      const hiddenPatterns = [
        /\x89PNG[\s\S]*?IDAT/,
        /\xff\xd8[\s\S]*?\xff\xd9/,
        /BM[\s\S]{8}/
      ];
      
      for (const pattern of hiddenPatterns) {
        if (pattern.test(content.toString('latin1'))) {
          return {
            hasStego: true,
            method: 'Hidden image embedded'
          };
        }
      }
      
      return {
        hasStego: false,
        method: 'None'
      };
    } catch {
      return {
        hasStego: false,
        method: 'Error'
      };
    }
  }
}

export default QRCodeTool;
