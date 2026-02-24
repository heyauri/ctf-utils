/**
 * HTTP 分析工具
 * 用于分析HTTP请求和响应，提取关键信息，检测安全问题
 */

export interface HTTPRequest {
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: string;
  queryParams?: Record<string, string>;
  protocol: string;
  host: string;
  port: number;
}

export interface HTTPResponse {
  statusCode: number;
  statusMessage: string;
  headers: Record<string, string>;
  body?: string;
  cookies?: Record<string, string>;
}

export interface HTTPCookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * HTTP 分析器类
 */
export class HTTPAnalyzer {
  /**
   * 解析HTTP请求字符串
   * @param requestString HTTP请求字符串
   * @returns 解析后的HTTP请求对象
   */
  static parseRequest(requestString: string): HTTPRequest {
    const lines = requestString.trim().split('\r\n');
    const requestLine = lines[0];
    const [method, pathWithQuery, protocol] = requestLine.split(' ');
    
    // 解析路径和查询参数
    const [path, queryString] = pathWithQuery.split('?');
    const queryParams = this.parseQueryString(queryString || '');
    
    // 解析头部
    const headers: Record<string, string> = {};
    let bodyLines: string[] = [];
    let inBody = false;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line === '') {
        inBody = true;
        continue;
      }
      
      if (inBody) {
        bodyLines.push(line);
      } else {
        const [key, value] = line.split(': ');
        headers[key.toLowerCase()] = value;
      }
    }
    
    const body = bodyLines.length > 0 ? bodyLines.join('\r\n') : undefined;
    
    // 解析主机和端口
    const hostHeader = headers['host'] || '';
    const [host, portStr] = hostHeader.split(':');
    const port = parseInt(portStr) || (protocol === 'HTTPS/1.1' ? 443 : 80);
    
    return {
      method,
      path,
      headers,
      body,
      queryParams,
      protocol,
      host,
      port
    };
  }

  /**
   * 解析HTTP响应字符串
   * @param responseString HTTP响应字符串
   * @returns 解析后的HTTP响应对象
   */
  static parseResponse(responseString: string): HTTPResponse {
    const lines = responseString.trim().split('\r\n');
    const statusLine = lines[0];
    const [protocol, statusCode, ...statusMessageParts] = statusLine.split(' ');
    const statusMessage = statusMessageParts.join(' ');
    
    // 解析头部
    const headers: Record<string, string> = {};
    let bodyLines: string[] = [];
    let inBody = false;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line === '') {
        inBody = true;
        continue;
      }
      
      if (inBody) {
        bodyLines.push(line);
      } else {
        const [key, value] = line.split(': ');
        headers[key.toLowerCase()] = value;
      }
    }
    
    const body = bodyLines.length > 0 ? bodyLines.join('\r\n') : undefined;
    const cookies = this.parseSetCookieHeaders(headers['set-cookie'] || '');
    
    return {
      statusCode: parseInt(statusCode),
      statusMessage,
      headers,
      body,
      cookies
    };
  }

  /**
   * 解析查询字符串
   * @param queryString 查询字符串
   * @returns 解析后的查询参数对象
   */
  static parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {};
    if (!queryString) return params;
    
    const pairs = queryString.split('&');
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
    
    return params;
  }

  /**
   * 解析Set-Cookie头部
   * @param setCookieHeader Set-Cookie头部值
   * @returns 解析后的Cookie对象
   */
  static parseSetCookieHeaders(setCookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!setCookieHeader) return cookies;
    
    const cookieStrings = setCookieHeader.split('; ');
    const [nameValue] = cookieStrings[0].split('=');
    const [name, value] = nameValue.split('=');
    cookies[name] = value;
    
    return cookies;
  }

  /**
   * 解析Cookie字符串为详细Cookie对象
   * @param cookieString Cookie字符串
   * @returns 解析后的Cookie对象
   */
  static parseCookie(cookieString: string): HTTPCookie {
    const parts = cookieString.split('; ');
    const [name, value] = parts[0].split('=');
    
    const cookie: HTTPCookie = {
      name,
      value
    };
    
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part.startsWith('Domain=')) {
        cookie.domain = part.substring(7);
      } else if (part.startsWith('Path=')) {
        cookie.path = part.substring(5);
      } else if (part.startsWith('Expires=')) {
        cookie.expires = new Date(part.substring(8));
      } else if (part.startsWith('Max-Age=')) {
        cookie.maxAge = parseInt(part.substring(8));
      } else if (part === 'Secure') {
        cookie.secure = true;
      } else if (part === 'HttpOnly') {
        cookie.httpOnly = true;
      } else if (part.startsWith('SameSite=')) {
        cookie.sameSite = part.substring(9) as 'Strict' | 'Lax' | 'None';
      }
    }
    
    return cookie;
  }

  /**
   * 分析HTTP请求中的安全问题
   * @param request HTTP请求对象
   * @returns 安全问题列表
   */
  static analyzeRequestSecurity(request: HTTPRequest): string[] {
    const issues: string[] = [];
    
    // 检查HTTP方法
    if (request.method === 'GET' && request.body) {
      issues.push('GET请求包含请求体，可能导致某些服务器处理异常');
    }
    
    // 检查敏感头部
    if (request.headers['authorization']) {
      issues.push('请求包含Authorization头部，可能泄露认证信息');
    }
    
    // 检查查询参数
    if (request.queryParams) {
      const sensitiveParams = ['password', 'token', 'secret', 'key', 'auth'];
      for (const param of sensitiveParams) {
        if (request.queryParams[param]) {
          issues.push(`查询参数包含敏感信息: ${param}`);
        }
      }
    }
    
    // 检查Content-Type
    if (request.body && !request.headers['content-type']) {
      issues.push('请求包含body但未指定Content-Type');
    }
    
    return issues;
  }

  /**
   * 分析HTTP响应中的安全问题
   * @param response HTTP响应对象
   * @returns 安全问题列表
   */
  static analyzeResponseSecurity(response: HTTPResponse): string[] {
    const issues: string[] = [];
    
    // 检查安全头部
    if (!response.headers['content-security-policy']) {
      issues.push('响应缺少Content-Security-Policy头部');
    }
    
    if (!response.headers['x-content-type-options']) {
      issues.push('响应缺少X-Content-Type-Options头部');
    }
    
    if (!response.headers['x-frame-options']) {
      issues.push('响应缺少X-Frame-Options头部');
    }
    
    if (!response.headers['strict-transport-security'] && response.headers['location']?.startsWith('https://')) {
      issues.push('HTTPS响应缺少Strict-Transport-Security头部');
    }
    
    // 检查Cookie安全属性
    if (response.cookies) {
      for (const [name, value] of Object.entries(response.cookies)) {
        issues.push(`Cookie ${name} 缺少安全属性检查`);
      }
    }
    
    // 检查CORS头部
    if (response.headers['access-control-allow-origin']) {
      if (response.headers['access-control-allow-origin'] === '*') {
        issues.push('CORS设置为允许所有来源(*)，可能导致安全问题');
      }
    }
    
    return issues;
  }

  /**
   * 生成HTTP请求字符串
   * @param request HTTP请求对象
   * @returns HTTP请求字符串
   */
  static generateRequestString(request: HTTPRequest): string {
    const pathWithQuery = request.queryParams 
      ? `${request.path}?${Object.entries(request.queryParams)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&')}`
      : request.path;
    
    let requestString = `${request.method} ${pathWithQuery} ${request.protocol}\r\n`;
    
    // 添加头部
    for (const [key, value] of Object.entries(request.headers)) {
      requestString += `${key}: ${value}\r\n`;
    }
    
    // 添加空行
    requestString += '\r\n';
    
    // 添加请求体
    if (request.body) {
      requestString += request.body;
    }
    
    return requestString;
  }

  /**
   * 生成HTTP响应字符串
   * @param response HTTP响应对象
   * @returns HTTP响应字符串
   */
  static generateResponseString(response: HTTPResponse): string {
    let responseString = `HTTP/1.1 ${response.statusCode} ${response.statusMessage}\r\n`;
    
    // 添加头部
    for (const [key, value] of Object.entries(response.headers)) {
      responseString += `${key}: ${value}\r\n`;
    }
    
    // 添加空行
    responseString += '\r\n';
    
    // 添加响应体
    if (response.body) {
      responseString += response.body;
    }
    
    return responseString;
  }
}

export default HTTPAnalyzer;
