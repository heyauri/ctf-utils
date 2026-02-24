/**
 * Web 模块测试
 */

const solver = require('../../lib/solver/index.js');

const { HTTPAnalyzer } = solver.Web.HTTP;
const { WebSecurity } = solver.Web.Security;

console.log('【Web 模块测试】');
console.log('');

// 测试HTTP分析器
console.log('1. 测试HTTP分析器');
try {
  // 测试解析HTTP请求
  const requestString = 'GET /api/users HTTP/1.1\r\nHost: example.com\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\n\r\n';
  const request = HTTPAnalyzer.parseRequest(requestString);
  console.log(`   ${request.method === 'GET' && request.path === '/api/users' ? '✅' : '❌'} 解析HTTP请求测试通过`);
  
  // 测试解析HTTP响应
  const responseString = 'HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: 13\r\nSet-Cookie: session=abc123\r\n\r\n{"status":"ok"}';
  const response = HTTPAnalyzer.parseResponse(responseString);
  console.log(`   ${response.statusCode === 200 && response.statusMessage === 'OK' ? '✅' : '❌'} 解析HTTP响应测试通过`);
  
  // 测试分析请求安全问题
  const testRequest = {
    method: 'GET',
    path: '/api/users',
    protocol: 'HTTP/1.1',
    host: 'example.com',
    port: 80,
    headers: {
      'Host': 'example.com',
      'User-Agent': 'Mozilla/5.0'
    },
    body: ''
  };
  const requestIssues = HTTPAnalyzer.analyzeRequestSecurity(testRequest);
  console.log(`   ${Array.isArray(requestIssues) ? '✅' : '❌'} 分析请求安全问题测试通过`);
  
  // 测试分析响应安全问题
  const testResponse = {
    statusCode: 200,
    statusMessage: 'OK',
    protocol: 'HTTP/1.1',
    headers: {
      'Content-Type': 'text/html'
    },
    cookies: {},
    body: '<html><body>Hello</body></html>'
  };
  const responseIssues = HTTPAnalyzer.analyzeResponseSecurity(testResponse);
  console.log(`   ${Array.isArray(responseIssues) ? '✅' : '❌'} 分析响应安全问题测试通过`);
  
  // 测试生成HTTP请求
  const requestData = {
    method: 'POST',
    path: '/api/login',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    },
    body: '{"username":"test","password":"pass"}'
  };
  const generatedRequest = HTTPAnalyzer.generateRequestString(requestData);
  console.log(`   ${typeof generatedRequest === 'string' ? '✅' : '❌'} 生成HTTP请求测试通过`);
  
  // 测试生成HTTP响应
  const responseData = {
    statusCode: 401,
    statusMessage: 'Unauthorized',
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"error":"Invalid credentials"}'
  };
  const generatedResponse = HTTPAnalyzer.generateResponseString(responseData);
  console.log(`   ${typeof generatedResponse === 'string' ? '✅' : '❌'} 生成HTTP响应测试通过`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');

// 测试Web安全工具
console.log('2. 测试Web安全工具');
try {
  // 测试解析JWT token
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJleHAiOjk5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const jwt = WebSecurity.parseJWT(token);
  console.log(`   ${jwt.header && jwt.payload ? '✅' : '❌'} 解析JWT token测试通过`);
  
  // 测试验证JWT token
  const secret = 'secret';
  const verifyResult = WebSecurity.verifyJWT(token, secret);
  console.log(`   ${verifyResult ? '✅' : '❌'} 验证JWT token测试通过`);
  
  // 测试生成JWT token
  const payload = { username: 'test', role: 'user' };
  const generatedToken = WebSecurity.generateJWT(payload, secret);
  console.log(`   ${typeof generatedToken === 'string' && generatedToken.split('.').length === 3 ? '✅' : '❌'} 生成JWT token测试通过`);
  
  // 测试分析CSRF token
  const csrfToken = 'csrf_token_123';
  const csrfAnalysis = WebSecurity.analyzeCSRFToken(csrfToken);
  console.log(`   ${csrfAnalysis && typeof csrfAnalysis.strength === 'string' ? '✅' : '❌'} 分析CSRF token测试通过`);
  
  // 测试生成XSS payloads
  const xssType = 'stored';
  const xssPayloads = WebSecurity.generateXSSPayloads(xssType);
  console.log(`   ${Array.isArray(xssPayloads) && xssPayloads.length > 0 ? '✅' : '❌'} 生成XSS payloads测试通过`);
  
  // 测试检测XSS漏洞
  const html = '<div><script>alert("XSS")</script></div>';
  const xssVulnerabilities = WebSecurity.detectXSS(html);
  console.log(`   ${Array.isArray(xssVulnerabilities) ? '✅' : '❌'} 检测XSS漏洞测试通过`);
  
  // 测试分析会话管理安全
  const cookies = {
    session: 'session_id_123',
    user: 'test'
  };
  const sessionAnalysis = WebSecurity.analyzeSessionManagement(cookies);
  console.log(`   ${sessionAnalysis && Array.isArray(sessionAnalysis.issues) ? '✅' : '❌'} 分析会话管理安全测试通过`);
  
  // 测试检测SQL注入模式
  const input = "' OR 1=1 --";
  const sqlInjectionResult = WebSecurity.detectSQLInjection(input);
  console.log(`   ${sqlInjectionResult ? '✅' : '❌'} 检测SQL注入模式测试通过`);
} catch (error) {
  console.log(`   ❌ 测试失败: ${error.message}`);
}

console.log('');
console.log('【测试完成】');
