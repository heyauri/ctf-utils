import * as fs from 'fs';

export interface VideoInfo {
  format: string;
  duration: number;
  resolution: string;
  codec: string;
  bitrate: number;
  fileSize: number;
}

export interface VideoStegoResult {
  hasHiddenData: boolean;
  method: string;
  data: Buffer | null;
}

export interface FrameData {
  index: number;
  timestamp: number;
  data: Buffer;
}

export class VideoSteganography {
  static getInfo(filePath: string): VideoInfo | null {
    try {
      const stats = fs.statSync(filePath);
      const ext = filePath.split('.').pop()?.toLowerCase() || '';
      
      const formatMap: Record<string, string> = {
        mp4: 'MP4',
        avi: 'AVI',
        mkv: 'MKV',
        mov: 'MOV',
        flv: 'FLV',
        wmv: 'WMV',
        webm: 'WebM'
      };
      
      const header = Buffer.alloc(12);
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, header, 0, 12, 0);
      fs.closeSync(fd);
      
      let format = formatMap[ext] || 'Unknown';
      let codec = 'Unknown';
      
      if (header[4] === 0x66 && header[5] === 0x74 && header[6] === 0x79) {
        codec = 'MP4/QuickTime';
      } else if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) {
        codec = 'AVI';
      }
      
      return {
        format,
        duration: 0,
        resolution: 'Unknown',
        codec,
        bitrate: 0,
        fileSize: stats.size
      };
    } catch {
      return null;
    }
  }
  
  static detectLSBStego(filePath: string): VideoStegoResult {
    try {
      const content = fs.readFileSync(filePath);
      let zeroCount = 0;
      let oneCount = 0;
      
      const sampleSize = Math.min(100000, content.length);
      for (let i = 0; i < sampleSize; i++) {
        const lsb = content[i] & 1;
        if (lsb === 0) zeroCount++;
        else oneCount++;
      }
      
      const ratio = Math.abs(zeroCount - oneCount) / sampleSize;
      
      if (ratio < 0.02) {
        return {
          hasHiddenData: true,
          method: 'LSB Modification',
          data: null
        };
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
  
  static extractMetadata(filePath: string): Record<string, string> {
    try {
      const content = fs.readFileSync(filePath, 'latin1');
      const metadata: Record<string, string> = {};
      
      const titleMatch = content.match(/title[^\x00]+([^\x00]+)/i);
      if (titleMatch) metadata.title = titleMatch[1].trim();
      
      const authorMatch = content.match(/author[^\x00]+([^\x00]+)/i);
      if (authorMatch) metadata.author = authorMatch[1].trim();
      
      const commentMatch = content.match(/comment[^\x00]+([^\x00]+)/i);
      if (commentMatch) metadata.comment = commentMatch[1].trim();
      
      return metadata;
    } catch {
      return {};
    }
  }
  
  static findHiddenStreams(filePath: string): string[] {
    try {
      const content = fs.readFileSync(filePath, 'latin1');
      const streams: string[] = [];
      
      const patterns = [
        /\x00\x00\x00\x18\x6B\x74\x78\x74/g,
        /\x00\x00\x00\x1C\x6D\x6F\x6F\x76/g,
        /\x00\x00\x00\x14\x66\x74\x79\x70/g,
        /\x00\x00\x00\x08\x6D\x64\x61\x74/g
      ];
      
      for (const pattern of patterns) {
        const matches = content.match(pattern);
        if (matches) {
          streams.push(...matches);
        }
      }
      
      return [...new Set(streams)];
    } catch {
      return [];
    }
  }
  
  static detectFrameStego(filePath: string): VideoStegoResult {
    try {
      const content = fs.readFileSync(filePath);
      
      const frameMarkers = [
        Buffer.from([0x00, 0x00, 0x01, 0x00]),
        Buffer.from([0x00, 0x00, 0x01, 0xB6]),
        Buffer.from([0x00, 0x00, 0x01, 0xB8])
      ];
      
      let frameCount = 0;
      for (const marker of frameMarkers) {
        let pos = 0;
        while ((pos = content.indexOf(marker, pos)) !== -1) {
          frameCount++;
          pos += marker.length;
        }
      }
      
      if (frameCount > 0 && content.length / frameCount > 100000) {
        return {
          hasHiddenData: true,
          method: 'Frame Anomaly',
          data: null
        };
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
}

export default VideoSteganography;
