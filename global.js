#!/usr/bin/env node

/**
 * Command-line interface for CTF-Utils
 */

const { Command } = require('commander');
const readline = require('readline');
const { encode, decode, detectAll, CTFUtils, solver } = require("./lib");
const program = new Command();
const chalk = require('chalk');

program
    .name('ctf-utils')
    .description('CLI to some ctf utilities')
    .version('0.3.0');

/**
 * Start interactive mode
 */
async function startInteractiveMode() {
  // 命令历史数组
  const commandHistory = [];
  let historyIndex = -1;
  
  // 可用命令列表，用于自动补全
  const availableCommands = [
    'help', 'exit', 'quit', 'clear', 'history',
    'decode', 'encode', 'detect', 'solve', 'forensics', 'web', 'reverse', 'hash',
    'solve rsa', 'solve math', 'solve exploitation',
    'forensics binary', 'forensics memory', 'forensics network',
    'web http', 'web security',
    'reverse binary', 'reverse disasm', 'reverse strings', 'reverse symbols', 'reverse cflow',
    'hash analyze', 'hash brute', 'hash dict', 'hash rainbow', 'hash collision', 'hash prefix', 'hash length-extension'
  ];
  
  // 自动补全函数
  function completer(line) {
    const hits = availableCommands.filter(cmd => cmd.startsWith(line));
    return [hits.length ? hits : availableCommands, line];
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'ctf-utils> ',
    historySize: 50,
    completer: completer
  });

  console.log(chalk.blue.bold('====================================='));
  console.log(chalk.blue.bold('        CTF-Utils Interactive Mode        '));
  console.log(chalk.blue.bold('====================================='));
  console.log(chalk.green('Type \'help\' for available commands'));
  console.log(chalk.green('Type \'exit\' or \'quit\' to exit'));
  console.log(chalk.green('Type \'clear\' to clear the screen'));
  console.log(chalk.green('Type \'history\' to see command history'));
  console.log(chalk.green('Use up/down arrows to navigate command history'));
  console.log(chalk.green('Press Tab for command auto-completion'));
  console.log('');
  console.log(chalk.yellow('Example commands:'));
  console.log('  decode SGVsbG8gV29ybGQ=');
  console.log('  encode hello base64');
  console.log('  detect SGVsbG8gV29ybGQ=');
  console.log('  solve rsa keygen');
  console.log('');

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    
    // Add to command history
    if (input && input !== 'history') {
      commandHistory.push(input);
      if (commandHistory.length > 50) {
        commandHistory.shift();
      }
      historyIndex = commandHistory.length;
    }
    
    if (input === '' || input === 'help') {
      showHelp();
    } else if (input === 'exit' || input === 'quit') {
      rl.close();
    } else if (input === 'clear') {
      console.clear();
      console.log(chalk.blue.bold('====================================='));
      console.log(chalk.blue.bold('        CTF-Utils Interactive Mode        '));
      console.log(chalk.blue.bold('====================================='));
      console.log('');
    } else if (input === 'history') {
      console.log('Command history:');
      commandHistory.forEach((cmd, index) => {
        console.log(`${index + 1}. ${cmd}`);
      });
    } else if (input.startsWith('decode ')) {
      const [, encoded] = input.split(' ', 2);
      if (encoded) {
        await decodeCommand(encoded);
      } else {
        console.log(chalk.red('Usage: decode <encoded-string>'));
      }
    } else if (input.startsWith('encode ')) {
      const [, plaintext, method] = input.split(' ', 3);
      if (plaintext && method) {
        await encodeCommand(plaintext, method);
      } else {
        console.log(chalk.red('Usage: encode <plaintext> <method>'));
      }
    } else if (input.startsWith('detect ')) {
      const [, text] = input.split(' ', 2);
      if (text) {
        await detectCommand(text);
      } else {
        console.log(chalk.red('Usage: detect <text>'));
      }
    } else if (input.startsWith('solve ')) {
      const [, problemType, ...problemArgs] = input.split(' ');
      if (problemType) {
        await solveCommand(problemType, problemArgs);
      } else {
        console.log(chalk.red('Usage: solve <problem-type> [args...]'));
      }
    } else if (input.startsWith('forensics ')) {
      const [, forensicsType, ...forensicsArgs] = input.split(' ');
      if (forensicsType) {
        await forensicsCommand(forensicsType, forensicsArgs);
      } else {
        console.log(chalk.red('Usage: forensics <type> [args...]'));
      }
    } else if (input.startsWith('web ')) {
      const [, webType, ...webArgs] = input.split(' ');
      if (webType) {
        await webCommand(webType, webArgs);
      } else {
        console.log(chalk.red('Usage: web <type> [args...]'));
      }
    } else if (input.startsWith('reverse ')) {
      const [, reverseType, ...reverseArgs] = input.split(' ');
      if (reverseType) {
        await reverseCommand(reverseType, reverseArgs);
      } else {
        console.log(chalk.red('Usage: reverse <type> [args...]'));
      }
    } else if (input.startsWith('hash ')) {
      const [, hashType, ...hashArgs] = input.split(' ');
      if (hashType) {
        await hashCommand(hashType, hashArgs);
      } else {
        console.log(chalk.red('Usage: hash <type> [args...]'));
      }
    } else {
      console.log(chalk.red('Unknown command. Type \'help\' for available commands.'));
    }
    
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('');
    console.log(chalk.green('Goodbye!'));
    process.exit(0);
  });
}

/**
 * Show help message
 */
function showHelp() {
  console.log(chalk.blue.bold('====================================='));
  console.log(chalk.blue.bold('            CTF-Utils Help            '));
  console.log(chalk.blue.bold('====================================='));
  console.log('');
  console.log(chalk.green.bold('Available commands:'));
  console.log('');
  console.log(chalk.yellow('  decode <encoded-string>   - Try to decode an encoded string'));
  console.log(chalk.yellow('  encode <plaintext> <method> - Encode plaintext using specified method'));
  console.log(chalk.yellow('  detect <text>            - Detect encoding/cipher type of text'));
  console.log(chalk.yellow('  solve <problem-type> [args...] - Solve specific CTF problems'));
  console.log(chalk.yellow('  forensics <type> [args...] - Forensics tools for CTF problems'));
  console.log(chalk.yellow('  web <type> [args...]      - Web security and HTTP analysis tools'));
  console.log(chalk.yellow('  reverse <type> [args...]  - Reverse engineering tools for binary analysis'));
  console.log(chalk.yellow('  hash <type> [args...]     - Hash analysis and attack tools'));
  console.log(chalk.yellow('  help                     - Show this help message'));
  console.log(chalk.yellow('  clear                    - Clear the screen'));
  console.log(chalk.yellow('  history                  - Show command history'));
  console.log(chalk.yellow('  exit/quit                - Exit interactive mode'));
  console.log('');
  console.log(chalk.green.bold('Available solve problem types:'));
  console.log('');
  console.log(chalk.yellow('  rsa - RSA cryptography problems'));
  console.log(chalk.yellow('  exploitation - Binary exploitation problems'));
  console.log(chalk.yellow('  math - Math problems'));
  console.log('');
  console.log(chalk.green.bold('Available forensics tools:'));
  console.log('');
  console.log(chalk.yellow('  binary - Binary file analysis tools'));
  console.log(chalk.yellow('  memory - Memory forensics tools'));
  console.log(chalk.yellow('  network - Network traffic analysis tools'));
  console.log('');
  console.log(chalk.green.bold('Available web tools:'));
  console.log('');
  console.log(chalk.yellow('  http - HTTP request/response analysis'));
  console.log(chalk.yellow('  security - Web security tools (JWT, CSRF, XSS)'));
  console.log('');
  console.log(chalk.green.bold('Available reverse engineering tools:'));
  console.log('');
  console.log(chalk.yellow('  binary - Binary file analysis and control flow analysis'));
  console.log(chalk.yellow('  disasm - Disassemble binary code'));
  console.log(chalk.yellow('  strings - Extract strings from binary'));
  console.log(chalk.yellow('  symbols - Analyze binary symbols'));
  console.log(chalk.yellow('  cflow - Control flow graph analysis'));
  console.log('');
  console.log(chalk.green.bold('Available hash tools:'));
  console.log('');
  console.log(chalk.yellow('  analyze - Analyze hash type'));
  console.log(chalk.yellow('  brute - Brute force hash cracking'));
  console.log(chalk.yellow('  dict - Dictionary attack on hash'));
  console.log(chalk.yellow('  rainbow - Rainbow table attack on hash'));
  console.log(chalk.yellow('  collision - Find hash collisions'));
  console.log(chalk.yellow('  prefix - Generate hash with specified prefix'));
  console.log(chalk.yellow('  length-extension - Perform hash length extension attack'));
  console.log('');
  console.log(chalk.green.bold('Example commands:'));
  console.log('');
  console.log(chalk.yellow('  decode SGVsbG8gV29ybGQ='));
  console.log(chalk.yellow('  encode hello base64'));
  console.log(chalk.yellow('  detect SGVsbG8gV29ybGQ='));
  console.log(chalk.yellow('  solve rsa keygen'));
  console.log(chalk.yellow('  forensics binary analyze file.bin'));
  console.log(chalk.yellow('  web http parse-request "GET / HTTP/1.1\r\nHost: example.com\r\n\r\n"'));
  console.log(chalk.yellow('  reverse binary analyze file.bin'));
  console.log(chalk.yellow('  reverse cflow generate file.bin'));
  console.log(chalk.yellow('  hash analyze 5d41402abc4b2a76b9719d911017c592'));
  console.log(chalk.yellow('  hash brute 5d41402abc4b2a76b9719d911017c592 abcdefghijklmnopqrstuvwxyz 3'));
  console.log('');
}

/**
 * Handle decode command
 */
async function decodeCommand(encoded) {
  try {
    console.log('Attempting to decode...');
    console.log('Input:', encoded);
    
    // Try common encodings in parallel for faster execution
    const decoders = ['base64', 'base32', 'base16', 'hex', 'rot13'];
    const decodePromises = decoders.map(async (decoder) => {
      try {
        const tempCtf = new CTFUtils(encoded);
        const decodeMethod = (tempCtf.decode)[decoder];
        if (typeof decodeMethod === 'function') {
          await decodeMethod.call(tempCtf);
          return { method: decoder, result: tempCtf.val() };
        }
      } catch {
        // Ignore errors
      }
      return null;
    });
    
    // Wait for all decoding attempts to complete
    const results = await Promise.all(decodePromises);
    
    // Display successful results
    const successfulResults = results.filter(result => result !== null);
    if (successfulResults.length > 0) {
      console.log('\nSuccessful decodes:');
      successfulResults.forEach(({ method, result }) => {
        console.log(chalk.green(`${method}:`), chalk.white(result));
      });
    } else {
      console.log(chalk.yellow('No successful decodes found. Try using a specific method with: decode <method> <encoded-string>'));
    }
  } catch (error) {
    console.error(chalk.red('Error decoding:'), error.message);
  }
}

/**
 * Handle encode command
 */
async function encodeCommand(plaintext, method) {
  try {
    const ctf = new CTFUtils(plaintext);
    const encodeMethod = (ctf.encode)[method];
    
    if (typeof encodeMethod === 'function') {
      await encodeMethod.call(ctf);
      console.log(`Encoded (${method}):`, ctf.val());
    } else {
      console.log(`Unknown encoding method: ${method}`);
    }
  } catch (error) {
    console.error('Error encoding:', error.message);
  }
}

/**
 * Handle detect command
 */
async function detectCommand(text) {
  try {
    console.log(chalk.bgBlue('Input:'), chalk.white(text));
    console.log(chalk.blue('Detecting encoding/cipher type...'));
    
    // Measure detection time for performance feedback
    const startTime = Date.now();
    let result = await detectAll(text);
    const endTime = Date.now();
    
    // Filter and format results
    const detectedTypes = Object.keys(result).filter(curr => {
        let val = result[curr];
        return (result[curr] && typeof val === "boolean") || 
               (result[curr] && Array.isArray(val) && val.length > 1);
    });
    
    console.log(chalk.green(`Detection completed in ${endTime - startTime}ms`));
    console.log(chalk.blue('Detected types:'));
    
    if (detectedTypes.length > 0) {
      detectedTypes.forEach(type => {
        console.log(chalk.yellow(`  • ${type}`));
      });
    } else {
      console.log(chalk.yellow('  No specific encoding/cipher type detected'));
    }
    
    console.log(chalk.blue('\nTry decoding with:'));
    if (detectedTypes.length > 0) {
      detectedTypes.forEach(type => {
        console.log(chalk.green(`  decode ${type} "${text}"`));
      });
    } else {
      console.log(chalk.green(`  decode base64 "${text}"`));
      console.log(chalk.green(`  decode hex "${text}"`));
      console.log(chalk.green(`  decode rot13 "${text}"`));
    }
  } catch (error) {
    console.error(chalk.red('Error detecting:'), error.message);
  }
}

/**
 * Handle solve command
 */
async function solveCommand(problemType, args) {
  try {
    const subCommand = args[0];
    
    switch (problemType) {
      case 'rsa':
        if (subCommand === 'keygen') {
          console.log(chalk.blue.bold('Generating RSA key pair...'));
          // Generate RSA key pair
          const { RSA } = solver.Crypto;
          const keyPair = RSA.generateKeyPair();
          console.log(chalk.green('Public key:'));
          console.log(chalk.yellow(`  n: ${keyPair.publicKey.n}`));
          console.log(chalk.yellow(`  e: ${keyPair.publicKey.e}`));
          console.log(chalk.green('Private key:'));
          console.log(chalk.yellow(`  d: ${keyPair.privateKey.d}`));
          console.log(chalk.yellow(`  n: ${keyPair.privateKey.n}`));
        } else {
          console.log(chalk.blue.bold('RSA solver commands:'));
          console.log(chalk.yellow('  solve rsa keygen - Generate RSA key pair'));
          console.log(chalk.yellow('  solve rsa encrypt <plaintext> <public-key> - Encrypt with RSA'));
          console.log(chalk.yellow('  solve rsa decrypt <ciphertext> <private-key> - Decrypt with RSA'));
          console.log(chalk.yellow('  solve rsa attack <attack-type> [args...] - Run RSA attack'));
        }
        break;
      case 'math':
        if (subCommand === 'gcd' && args.length >= 3) {
          const a = BigInt(args[1]);
          const b = BigInt(args[2]);
          const { Math: MathUtils } = solver;
          const result = MathUtils.gcd(a, b);
          console.log(chalk.green(`gcd(${a}, ${b}) = ${result}`));
        } else if (subCommand === 'lcm' && args.length >= 3) {
          const a = BigInt(args[1]);
          const b = BigInt(args[2]);
          const { Math: MathUtils } = solver;
          const result = MathUtils.lcm(a, b);
          console.log(chalk.green(`lcm(${a}, ${b}) = ${result}`));
        } else if (subCommand === 'isprime' && args.length >= 2) {
          const n = BigInt(args[1]);
          const { Math: MathUtils } = solver;
          const result = MathUtils.isPrime(n);
          console.log(chalk.green(`${n} is ${result ? 'prime' : 'not prime'}`));
        } else if (subCommand === 'factorize' && args.length >= 2) {
          const n = BigInt(args[1]);
          const { Math: MathUtils } = solver;
          console.log(chalk.blue(`Factorizing ${n}...`));
          const startTime = Date.now();
          const factors = MathUtils.factorize(n);
          const endTime = Date.now();
          console.log(chalk.green(`Factors: ${factors.join(' * ')}`));
          console.log(chalk.green(`Time taken: ${endTime - startTime}ms`));
        } else {
          console.log(chalk.blue.bold('Math solver commands:'));
          console.log(chalk.yellow('  solve math gcd <a> <b> - Calculate GCD'));
          console.log(chalk.yellow('  solve math lcm <a> <b> - Calculate LCM'));
          console.log(chalk.yellow('  solve math isprime <n> - Check if number is prime'));
          console.log(chalk.yellow('  solve math factorize <n> - Factorize number'));
        }
        break;
      case 'exploitation':
        console.log(chalk.blue.bold('Exploitation solver commands:'));
        console.log(chalk.yellow('  solve exploitation rop - Generate ROP chain'));
        console.log(chalk.yellow('  solve exploitation shellcode - Generate shellcode'));
        console.log(chalk.yellow('  solve exploitation bufferoverflow - Generate buffer overflow payload'));
        break;
      default:
        console.log(chalk.red(`Unknown problem type: ${problemType}`));
    }
  } catch (error) {
    console.error(chalk.red('Error solving:', error.message));
  }
}

/**
 * Handle forensics command
 */
async function forensicsCommand(forensicsType, args) {
  try {
    const subCommand = args[0];
    
    switch (forensicsType) {
      case 'binary':
        if (subCommand === 'analyze' && args.length >= 2) {
          const filePath = args[1];
          console.log(chalk.blue.bold(`Analyzing binary file: ${filePath}`));
          // Analyze binary file
          const { BinaryFile } = solver.Forensics;
          try {
            const info = BinaryFile.analyzeFile(filePath);
            console.log(chalk.green('File information:'));
            console.log(chalk.yellow(`  Type: ${info.type}`));
            console.log(chalk.yellow(`  Size: ${info.size} bytes`));
            if (info.details) {
              console.log(chalk.green('Details:'));
              Object.entries(info.details).forEach(([key, value]) => {
                console.log(chalk.yellow(`  ${key}: ${value}`));
              });
            }
          } catch (error) {
            console.error(chalk.red('Error analyzing file:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Binary forensics commands:'));
          console.log(chalk.yellow('  forensics binary analyze <file> - Analyze binary file'));
          console.log(chalk.yellow('  forensics binary search <file> <pattern> - Search pattern in binary'));
          console.log(chalk.yellow('  forensics binary extract <file> <offset> <length> - Extract region from binary'));
        }
        break;
      case 'memory':
        console.log(chalk.blue.bold('Memory forensics commands:'));
        console.log(chalk.yellow('  forensics memory analyze <dump> - Analyze memory dump'));
        console.log(chalk.yellow('  forensics memory strings <dump> - Extract strings from memory dump'));
        console.log(chalk.yellow('  forensics memory search <dump> <pattern> - Search pattern in memory dump'));
        break;
      case 'network':
        console.log(chalk.blue.bold('Network forensics commands:'));
        console.log(chalk.yellow('  forensics network analyze <pcap> - Analyze PCAP file'));
        console.log(chalk.yellow('  forensics network extract <pcap> <filter> - Extract packets from PCAP'));
        break;
      default:
        console.log(chalk.red(`Unknown forensics type: ${forensicsType}`));
    }
  } catch (error) {
    console.error(chalk.red('Error in forensics command:', error.message));
  }
}

/**
 * Handle web command
 */
async function webCommand(webType, args) {
  try {
    const subCommand = args[0];
    
    switch (webType) {
      case 'http':
        if (subCommand === 'parse-request' && args.length >= 2) {
          const requestString = args.slice(1).join(' ');
          console.log(chalk.blue.bold('Parsing HTTP request...'));
          const { HTTPAnalyzer } = solver.Web.HTTP;
          try {
            const request = HTTPAnalyzer.parseRequest(requestString);
            console.log(chalk.green('Request information:'));
            console.log(chalk.yellow(`  Method: ${request.method}`));
            console.log(chalk.yellow(`  Path: ${request.path}`));
            console.log(chalk.yellow(`  Protocol: ${request.protocol}`));
            console.log(chalk.yellow(`  Host: ${request.host}:${request.port}`));
            if (request.queryParams && Object.keys(request.queryParams).length > 0) {
              console.log(chalk.green('Query parameters:'));
              Object.entries(request.queryParams).forEach(([key, value]) => {
                console.log(chalk.yellow(`  ${key}: ${value}`));
              });
            }
            console.log(chalk.green('Headers:'));
            Object.entries(request.headers).forEach(([key, value]) => {
              console.log(chalk.yellow(`  ${key}: ${value}`));
            });
            if (request.body) {
              console.log(chalk.green('Body:'));
              console.log(chalk.yellow(`  ${request.body}`));
            }
            
            // Analyze security
            const securityIssues = HTTPAnalyzer.analyzeRequestSecurity(request);
            if (securityIssues.length > 0) {
              console.log(chalk.red('Security issues:'));
              securityIssues.forEach(issue => {
                console.log(chalk.yellow(`  - ${issue}`));
              });
            } else {
              console.log(chalk.green('No security issues detected'));
            }
          } catch (error) {
            console.error(chalk.red('Error parsing request:', error.message));
          }
        } else if (subCommand === 'parse-response' && args.length >= 2) {
          const responseString = args.slice(1).join(' ');
          console.log(chalk.blue.bold('Parsing HTTP response...'));
          const { HTTPAnalyzer } = solver.Web.HTTP;
          try {
            const response = HTTPAnalyzer.parseResponse(responseString);
            console.log(chalk.green('Response information:'));
            console.log(chalk.yellow(`  Status: ${response.statusCode} ${response.statusMessage}`));
            console.log(chalk.green('Headers:'));
            Object.entries(response.headers).forEach(([key, value]) => {
              console.log(chalk.yellow(`  ${key}: ${value}`));
            });
            if (response.cookies && Object.keys(response.cookies).length > 0) {
              console.log(chalk.green('Cookies:'));
              Object.entries(response.cookies).forEach(([key, value]) => {
                console.log(chalk.yellow(`  ${key}: ${value}`));
              });
            }
            if (response.body) {
              console.log(chalk.green('Body:'));
              console.log(chalk.yellow(`  ${response.body}`));
            }
            
            // Analyze security
            const securityIssues = HTTPAnalyzer.analyzeResponseSecurity(response);
            if (securityIssues.length > 0) {
              console.log(chalk.red('Security issues:'));
              securityIssues.forEach(issue => {
                console.log(chalk.yellow(`  - ${issue}`));
              });
            } else {
              console.log(chalk.green('No security issues detected'));
            }
          } catch (error) {
            console.error(chalk.red('Error parsing response:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('HTTP commands:'));
          console.log(chalk.yellow('  web http parse-request <request-string> - Parse HTTP request'));
          console.log(chalk.yellow('  web http parse-response <response-string> - Parse HTTP response'));
          console.log(chalk.yellow('  web http analyze-security <request/response> - Analyze security issues'));
        }
        break;
      case 'security':
        if (subCommand === 'parse-jwt' && args.length >= 2) {
          const token = args[1];
          console.log(chalk.blue.bold('Parsing JWT token...'));
          const { WebSecurity } = solver.Web.Security;
          try {
            const jwt = WebSecurity.parseJWT(token);
            console.log(chalk.green('JWT information:'));
            console.log(chalk.yellow(`  Header: ${JSON.stringify(jwt.header, null, 2)}`));
            console.log(chalk.yellow(`  Payload: ${JSON.stringify(jwt.payload, null, 2)}`));
            console.log(chalk.yellow(`  Is expired: ${jwt.isExpired}`));
            console.log(chalk.yellow(`  Is valid: ${jwt.isValid}`));
            if (jwt.errors.length > 0) {
              console.log(chalk.red('Errors:'));
              jwt.errors.forEach(error => {
                console.log(chalk.yellow(`  - ${error}`));
              });
            }
          } catch (error) {
            console.error(chalk.red('Error parsing JWT:', error.message));
          }
        } else if (subCommand === 'generate-xss' && args.length >= 2) {
          const xssType = args[1];
          console.log(chalk.blue.bold(`Generating XSS payloads for ${xssType}...`));
          const { WebSecurity } = solver.Web.Security;
          try {
            const payloads = WebSecurity.generateXSSPayloads(xssType);
            console.log(chalk.green('XSS payloads:'));
            payloads.forEach((payload, index) => {
              console.log(chalk.yellow(`  ${index + 1}. ${payload.payload}`));
              console.log(chalk.yellow(`     Type: ${payload.type}, Effectiveness: ${payload.effectiveness}`));
              console.log(chalk.yellow(`     Description: ${payload.description}`));
            });
          } catch (error) {
            console.error(chalk.red('Error generating XSS payloads:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Web security commands:'));
          console.log(chalk.yellow('  web security parse-jwt <token> - Parse and analyze JWT token'));
          console.log(chalk.yellow('  web security verify-jwt <token> <secret> - Verify JWT signature'));
          console.log(chalk.yellow('  web security generate-jwt <payload> <secret> - Generate JWT token'));
          console.log(chalk.yellow('  web security analyze-csrf <token> - Analyze CSRF token security'));
          console.log(chalk.yellow('  web security generate-xss <type> - Generate XSS test payloads'));
          console.log(chalk.yellow('  web security detect-xss <html> - Detect XSS vulnerabilities in HTML'));
          console.log(chalk.yellow('  web security analyze-session <cookies> - Analyze session management security'));
          console.log(chalk.yellow('  web security detect-sql-injection <input> - Detect SQL injection patterns'));
        }
        break;
      default:
        console.log(chalk.red(`Unknown web type: ${webType}`));
    }
  } catch (error) {
    console.error(chalk.red('Error in web command:', error.message));
  }
}

/**
 * Handle reverse engineering command
 */
async function reverseCommand(reverseType, args) {
  try {
    const subCommand = args[0];
    
    switch (reverseType) {
      case 'binary':
        if (subCommand === 'analyze' && args.length >= 2) {
          const filePath = args[1];
          console.log(chalk.blue.bold(`Analyzing binary file: ${filePath}`));
          const { BinaryAnalysis } = solver.ReverseEngineering;
          try {
            const structure = BinaryAnalysis.analyzeBinaryStructure(filePath);
            console.log(chalk.green('Binary structure:'));
            console.log(chalk.yellow(`  Format: ${structure.format}`));
            console.log(chalk.yellow(`  Architecture: ${structure.architecture}`));
            console.log(chalk.yellow(`  Entry point: ${structure.entryPoint}`));
            console.log(chalk.green('Sections:'));
            structure.sections.forEach(section => {
              console.log(chalk.yellow(`  ${section.name}: size=${section.size}, address=${section.address}, permissions=${section.permissions}`));
            });
            
            const security = BinaryAnalysis.analyzeBinarySecurity(filePath);
            console.log(chalk.green('Security features:'));
            console.log(chalk.yellow(`  Stack canary: ${security.canary}`));
            console.log(chalk.yellow(`  PIE: ${security.pie}`));
            console.log(chalk.yellow(`  NX bit: ${security.nx}`));
            console.log(chalk.yellow(`  RELRO: ${security.relro}`));
            console.log(chalk.yellow(`  Symbols: ${security.symbols}`));
            
            const vulnerabilities = BinaryAnalysis.analyzeVulnerabilities(filePath);
            if (vulnerabilities.length > 0) {
              console.log(chalk.red('Potential vulnerabilities:'));
              vulnerabilities.forEach(vuln => {
                console.log(chalk.yellow(`  ${vuln.type} at ${vuln.address}: ${vuln.description}`));
              });
            } else {
              console.log(chalk.green('No potential vulnerabilities detected'));
            }
          } catch (error) {
            console.error(chalk.red('Error analyzing binary:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Binary analysis commands:'));
          console.log(chalk.yellow('  reverse binary analyze <file> - Analyze binary file structure and security'));
          console.log(chalk.yellow('  reverse binary info <file> - Get basic binary information'));
        }
        break;
      case 'disasm':
        if (subCommand === 'code' && args.length >= 4) {
          const filePath = args[1];
          const startAddress = args[2];
          const endAddress = args[3];
          console.log(chalk.blue.bold(`Disassembling code from ${startAddress} to ${endAddress} in ${filePath}`));
          const { BinaryAnalysis } = solver.ReverseEngineering;
          try {
            const instructions = BinaryAnalysis.disassembleBinary(filePath, startAddress, endAddress);
            console.log(chalk.green('Disassembled instructions:'));
            instructions.forEach(instr => {
              console.log(chalk.yellow(`  ${instr.address}: ${instr.mnemonic} ${instr.operands}`));
            });
          } catch (error) {
            console.error(chalk.red('Error disassembling:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Disassembly commands:'));
          console.log(chalk.yellow('  reverse disasm code <file> <start-address> <end-address> - Disassemble code'));
        }
        break;
      case 'strings':
        if (subCommand === 'extract' && args.length >= 2) {
          const filePath = args[1];
          console.log(chalk.blue.bold(`Extracting strings from ${filePath}`));
          const { BinaryAnalysis } = solver.ReverseEngineering;
          try {
            const strings = BinaryAnalysis.analyzeStrings(filePath);
            console.log(chalk.green('Extracted strings:'));
            strings.forEach(str => {
              console.log(chalk.yellow(`  ${str.address}: "${str.string}"`));
            });
          } catch (error) {
            console.error(chalk.red('Error extracting strings:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Strings commands:'));
          console.log(chalk.yellow('  reverse strings extract <file> - Extract strings from binary'));
        }
        break;
      case 'symbols':
        if (subCommand === 'analyze' && args.length >= 2) {
          const filePath = args[1];
          console.log(chalk.blue.bold(`Analyzing symbols in ${filePath}`));
          const { BinaryAnalysis } = solver.ReverseEngineering;
          try {
            const symbols = BinaryAnalysis.analyzeSymbols(filePath);
            if (symbols.imports.length > 0) {
              console.log(chalk.green('Imported symbols:'));
              symbols.imports.forEach(sym => {
                console.log(chalk.yellow(`  ${sym.name}: ${sym.address}`));
              });
            }
            if (symbols.exports.length > 0) {
              console.log(chalk.green('Exported symbols:'));
              symbols.exports.forEach(sym => {
                console.log(chalk.yellow(`  ${sym.name}: ${sym.address}`));
              });
            }
          } catch (error) {
            console.error(chalk.red('Error analyzing symbols:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Symbols commands:'));
          console.log(chalk.yellow('  reverse symbols analyze <file> - Analyze import/export symbols'));
        }
        break;
      case 'cflow':
        if (subCommand === 'generate' && args.length >= 2) {
          const filePath = args[1];
          console.log(chalk.blue.bold(`Generating control flow graph for ${filePath}`));
          const { BinaryAnalysis } = solver.ReverseEngineering;
          try {
            const cflow = BinaryAnalysis.analyzeControlFlow(filePath);
            console.log(chalk.green('Control flow graph:'));
            console.log(chalk.yellow(`  Entry point: ${cflow.entryPoint}`));
            console.log(chalk.green('Functions:'));
            cflow.functions.forEach(func => {
              console.log(chalk.yellow(`  ${func.name}: ${func.startAddress} - ${func.endAddress}`));
              console.log(chalk.yellow(`    Callers: ${func.callers.join(', ') || 'none'}`));
              console.log(chalk.yellow(`    Callees: ${func.callees.join(', ') || 'none'}`));
              console.log(chalk.yellow(`    Basic blocks: ${func.basicBlocks.length}`));
            });
          } catch (error) {
            console.error(chalk.red('Error generating control flow graph:', error.message));
          }
        } else if (subCommand === 'callgraph' && args.length >= 2) {
          const filePath = args[1];
          console.log(chalk.blue.bold(`Generating call graph for ${filePath}`));
          const { BinaryAnalysis } = solver.ReverseEngineering;
          try {
            const callGraph = BinaryAnalysis.generateCallGraph(filePath);
            console.log(chalk.green('Call graph:'));
            callGraph.forEach((callees, caller) => {
              console.log(chalk.yellow(`  ${caller} calls: ${callees.join(', ') || 'none'}`));
            });
          } catch (error) {
            console.error(chalk.red('Error generating call graph:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Control flow commands:'));
          console.log(chalk.yellow('  reverse cflow generate <file> - Generate control flow graph'));
          console.log(chalk.yellow('  reverse cflow callgraph <file> - Generate call graph'));
        }
        break;
      default:
        console.log(chalk.red(`Unknown reverse engineering type: ${reverseType}`));
    }
  } catch (error) {
    console.error(chalk.red('Error in reverse engineering command:', error.message));
  }
}

/**
 * Handle hash command
 */
async function hashCommand(hashType, args) {
  try {
    const subCommand = args[0];
    
    switch (hashType) {
      case 'analyze':
        if (args.length >= 2) {
          const hash = args[1];
          console.log(chalk.blue.bold(`Analyzing hash: ${hash}`));
          const { Hash } = solver.Crypto;
          try {
            const algorithms = Hash.analyzeHashType(hash);
            console.log(chalk.green('Possible hash algorithms:'));
            algorithms.forEach(algorithm => {
              console.log(chalk.yellow(`  • ${algorithm}`));
            });
          } catch (error) {
            console.error(chalk.red('Error analyzing hash:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Hash analyze commands:'));
          console.log(chalk.yellow('  hash analyze <hash> - Analyze hash type'));
        }
        break;
      case 'brute':
        if (args.length >= 4) {
          const hash = args[1];
          const charset = args[2];
          const maxLength = parseInt(args[3]);
          const algorithm = args[4] || 'md5';
          console.log(chalk.blue.bold(`Brute forcing hash: ${hash}`));
          console.log(chalk.blue(`Using charset: ${charset}, max length: ${maxLength}, algorithm: ${algorithm}`));
          const { Hash } = solver.Crypto;
          try {
            const startTime = Date.now();
            const result = Hash.bruteForceHash(hash, charset, maxLength, algorithm);
            const endTime = Date.now();
            if (result) {
              console.log(chalk.green(`Found plaintext: ${result}`));
              console.log(chalk.green(`Time taken: ${endTime - startTime}ms`));
            } else {
              console.log(chalk.yellow('No plaintext found within given parameters'));
              console.log(chalk.yellow(`Time taken: ${endTime - startTime}ms`));
            }
          } catch (error) {
            console.error(chalk.red('Error brute forcing hash:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Hash brute commands:'));
          console.log(chalk.yellow('  hash brute <hash> <charset> <max-length> [algorithm] - Brute force hash cracking'));
        }
        break;
      case 'dict':
        if (args.length >= 3) {
          const hash = args[1];
          const dictionaryPath = args[2];
          const algorithm = args[3] || 'md5';
          console.log(chalk.blue.bold(`Running dictionary attack on hash: ${hash}`));
          console.log(chalk.blue(`Using dictionary: ${dictionaryPath}, algorithm: ${algorithm}`));
          const { Hash } = solver.Crypto;
          try {
            const startTime = Date.now();
            const result = Hash.dictionaryAttack(hash, dictionaryPath, algorithm);
            const endTime = Date.now();
            if (result) {
              console.log(chalk.green(`Found plaintext: ${result}`));
              console.log(chalk.green(`Time taken: ${endTime - startTime}ms`));
            } else {
              console.log(chalk.yellow('No plaintext found in dictionary'));
              console.log(chalk.yellow(`Time taken: ${endTime - startTime}ms`));
            }
          } catch (error) {
            console.error(chalk.red('Error running dictionary attack:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Hash dict commands:'));
          console.log(chalk.yellow('  hash dict <hash> <dictionary-path> [algorithm] - Dictionary attack on hash'));
        }
        break;
      case 'rainbow':
        if (args.length >= 3) {
          const hash = args[1];
          const rainbowTablePath = args[2];
          const algorithm = args[3] || 'md5';
          console.log(chalk.blue.bold(`Running rainbow table attack on hash: ${hash}`));
          console.log(chalk.blue(`Using rainbow table: ${rainbowTablePath}, algorithm: ${algorithm}`));
          const { Hash } = solver.Crypto;
          try {
            const startTime = Date.now();
            const result = Hash.rainbowTableAttack(hash, rainbowTablePath, algorithm);
            const endTime = Date.now();
            if (result) {
              console.log(chalk.green(`Found plaintext: ${result}`));
              console.log(chalk.green(`Time taken: ${endTime - startTime}ms`));
            } else {
              console.log(chalk.yellow('No plaintext found in rainbow table'));
              console.log(chalk.yellow(`Time taken: ${endTime - startTime}ms`));
            }
          } catch (error) {
            console.error(chalk.red('Error running rainbow table attack:', error.message));
          }
        } else if (subCommand === 'generate' && args.length >= 6) {
          const charset = args[1];
          const minLength = parseInt(args[2]);
          const maxLength = parseInt(args[3]);
          const outputPath = args[4];
          const algorithm = args[5] || 'md5';
          console.log(chalk.blue.bold(`Generating rainbow table`));
          console.log(chalk.blue(`Charset: ${charset}, min length: ${minLength}, max length: ${maxLength}`));
          console.log(chalk.blue(`Output path: ${outputPath}, algorithm: ${algorithm}`));
          const { Hash } = solver.Crypto;
          try {
            const startTime = Date.now();
            Hash.generateRainbowTable(charset, minLength, maxLength, outputPath, algorithm);
            const endTime = Date.now();
            console.log(chalk.green(`Time taken: ${endTime - startTime}ms`));
          } catch (error) {
            console.error(chalk.red('Error generating rainbow table:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Hash rainbow commands:'));
          console.log(chalk.yellow('  hash rainbow <hash> <rainbow-table-path> [algorithm] - Rainbow table attack on hash'));
          console.log(chalk.yellow('  hash rainbow generate <charset> <min-length> <max-length> <output-path> [algorithm] - Generate rainbow table'));
        }
        break;
      case 'collision':
        if (args.length >= 1) {
          const algorithm = args[1] || 'md5';
          const maxAttempts = parseInt(args[2]) || 1000000;
          console.log(chalk.blue.bold(`Finding hash collisions for ${algorithm}`));
          console.log(chalk.blue(`Maximum attempts: ${maxAttempts}`));
          const { Hash } = solver.Crypto;
          try {
            const startTime = Date.now();
            const result = Hash.findHashCollision(algorithm, maxAttempts);
            const endTime = Date.now();
            if (result) {
              console.log(chalk.green(`Found collision:`));
              console.log(chalk.yellow(`  Input 1: ${result.input1}`));
              console.log(chalk.yellow(`  Input 2: ${result.input2}`));
              console.log(chalk.yellow(`  Hash: ${result.hash}`));
              console.log(chalk.green(`Time taken: ${endTime - startTime}ms`));
            } else {
              console.log(chalk.yellow('No collision found within maximum attempts'));
              console.log(chalk.yellow(`Time taken: ${endTime - startTime}ms`));
            }
          } catch (error) {
            console.error(chalk.red('Error finding hash collision:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Hash collision commands:'));
          console.log(chalk.yellow('  hash collision [algorithm] [max-attempts] - Find hash collisions'));
        }
        break;
      case 'prefix':
        if (args.length >= 2) {
          const prefix = args[1];
          const length = parseInt(args[2]) || prefix.length;
          const algorithm = args[3] || 'md5';
          console.log(chalk.blue.bold(`Generating hash with prefix: ${prefix}`));
          console.log(chalk.blue(`Length: ${length}, algorithm: ${algorithm}`));
          const { Hash } = solver.Crypto;
          try {
            const startTime = Date.now();
            const result = Hash.generateHashWithPrefix(prefix, length, algorithm);
            const endTime = Date.now();
            const generatedHash = require('crypto').createHash(algorithm).update(result).digest('hex');
            console.log(chalk.green(`Found input: ${result}`));
            console.log(chalk.green(`Generated hash: ${generatedHash}`));
            console.log(chalk.green(`Time taken: ${endTime - startTime}ms`));
          } catch (error) {
            console.error(chalk.red('Error generating hash with prefix:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Hash prefix commands:'));
          console.log(chalk.yellow('  hash prefix <prefix> [length] [algorithm] - Generate hash with specified prefix'));
        }
        break;
      case 'length-extension':
        if (args.length >= 5) {
          const originalHash = args[1];
          const originalData = args[2];
          const appendData = args[3];
          const keyLength = parseInt(args[4]);
          const algorithm = args[5] || 'sha1';
          console.log(chalk.blue.bold(`Performing hash length extension attack`));
          console.log(chalk.blue(`Original hash: ${originalHash}`));
          console.log(chalk.blue(`Original data: ${originalData}`));
          console.log(chalk.blue(`Data to append: ${appendData}`));
          console.log(chalk.blue(`Key length: ${keyLength}, algorithm: ${algorithm}`));
          const { Hash } = solver.Crypto;
          try {
            const result = Hash.hashLengthExtensionAttack(originalHash, originalData, appendData, keyLength, algorithm);
            console.log(chalk.green('Attack result:'));
            console.log(chalk.yellow(`  Extended hash: ${result.extendedHash}`));
            console.log(chalk.yellow(`  Combined data length: ${result.combinedData.length} bytes`));
          } catch (error) {
            console.error(chalk.red('Error performing length extension attack:', error.message));
          }
        } else {
          console.log(chalk.blue.bold('Hash length-extension commands:'));
          console.log(chalk.yellow('  hash length-extension <original-hash> <original-data> <append-data> <key-length> [algorithm] - Perform hash length extension attack'));
        }
        break;
      default:
        console.log(chalk.red(`Unknown hash type: ${hashType}`));
    }
  } catch (error) {
    console.error(chalk.red('Error in hash command:', error.message));
  }
}

/**
 * Detect action
 */
async function detectAction(Input) {
    await detectCommand(Input);
}

/**
 * Encode action
 */
async function encodeAction(method, Input, options) {
    const { key } = options;
    try {
        let result;
        if (key) {
            result = await encode[method](Input, key);
        } else {
            result = await encode[method](Input);
        }
        console.log(chalk.green(`[${method}]`) + ` ${Input} => ${result}`);
    } catch (err) {
        console.error(chalk.red(`Error: ${err.message}`));
    }
}

/**
 * Decode action
 */
async function decodeAction(method, Input, options) {
    const { key } = options;
    try {
        let result;
        if (key) {
            result = await decode[method](Input, key);
        } else {
            result = await decode[method](Input);
        }
        console.log(chalk.green(`[${method}]`) + ` ${Input} => ${result}`);
    } catch (err) {
        console.error(chalk.red(`Error: ${err.message}`));
    }
}

/**
 * Solve action
 */
async function solveAction(problemType, ...args) {
    await solveCommand(problemType, args);
}

// Command definitions
program
    .command("detect <Input>")
    .action(detectAction);

program
    .command("encode <method> <Input>")
    .option("-k, --key <key>", "encryption key")
    .action((method, Input, options) => encodeAction(method, Input, options));

program
    .command("decode <method> <Input>")
    .option("-k, --key <key>", "decryption key")
    .action((method, Input, options) => decodeAction(method, Input, options));

program
    .command("solve <problemType> [args...]")
    .action((problemType, ...args) => solveAction(problemType, ...args));

program
    .command("interactive")
    .description("Start interactive mode")
    .action(startInteractiveMode);

// If no command is provided, start interactive mode
if (process.argv.length === 2) {
  startInteractiveMode();
} else {
  program.parse();
}

