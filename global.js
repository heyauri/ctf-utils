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
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'ctf-utils> '
  });

  console.log(chalk.blue.bold('====================================='));
  console.log(chalk.blue.bold('        CTF-Utils Interactive Mode        '));
  console.log(chalk.blue.bold('====================================='));
  console.log(chalk.green('Type \'help\' for available commands'));
  console.log(chalk.green('Type \'exit\' or \'quit\' to exit'));
  console.log(chalk.green('Type \'clear\' to clear the screen'));
  console.log(chalk.green('Type \'history\' to see command history'));
  console.log('');
  console.log(chalk.yellow('Example commands:'));
  console.log('  decode SGVsbG8gV29ybGQ=');
  console.log('  encode hello base64');
  console.log('  detect SGVsbG8gV29ybGQ=');
  console.log('  solve rsa keygen');
  console.log('');

  const commandHistory = [];

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    
    // Add to command history
    if (input && input !== 'history') {
      commandHistory.push(input);
      if (commandHistory.length > 50) {
        commandHistory.shift();
      }
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
  console.log(chalk.green.bold('Example commands:'));
  console.log('');
  console.log(chalk.yellow('  decode SGVsbG8gV29ybGQ='));
  console.log(chalk.yellow('  encode hello base64'));
  console.log(chalk.yellow('  detect SGVsbG8gV29ybGQ='));
  console.log(chalk.yellow('  solve rsa keygen'));
  console.log(chalk.yellow('  forensics binary analyze file.bin'));
  console.log('');
}

/**
 * Handle decode command
 */
async function decodeCommand(encoded) {
  try {
    const ctf = new CTFUtils(encoded);
    console.log('Attempting to decode...');
    console.log('Input:', encoded);
    
    // Try common encodings
    const decoders = ['base64', 'base32', 'base16', 'hex', 'rot13'];
    
    for (const decoder of decoders) {
      try {
        const tempCtf = new CTFUtils(encoded);
        const decodeMethod = (tempCtf.decode)[decoder];
        if (typeof decodeMethod === 'function') {
          await decodeMethod.call(tempCtf);
          console.log(`${decoder}:`, tempCtf.val());
        }
      } catch {
        // Ignore errors
      }
    }
  } catch (error) {
    console.error('Error decoding:', error.message);
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
    console.log(chalk.bgBlue(text), ` is likely to be encoded as:`);
    let result = await detectAll(text);
    console.log(chalk.yellow(`${Object.keys(result).reduce((prev, curr) => {
        let val = result[curr];
        if (result[curr] && typeof val === "boolean") {
            prev.push(curr)
        }
        if (result[curr] && typeof val === "array" && val.length > 1) {
            prev.push(curr)
        }
        return prev
    }, []).join('\t') || "NULL"}`));
  } catch (error) {
    console.error('Error detecting:', error.message);
  }
}

/**
 * Handle solve command
 */
async function solveCommand(problemType, args) {
  try {
    switch (problemType) {
      case 'rsa':
        console.log(chalk.blue.bold('RSA solver commands:'));
        console.log(chalk.yellow('  solve rsa keygen - Generate RSA key pair'));
        console.log(chalk.yellow('  solve rsa encrypt <plaintext> <public-key> - Encrypt with RSA'));
        console.log(chalk.yellow('  solve rsa decrypt <ciphertext> <private-key> - Decrypt with RSA'));
        console.log(chalk.yellow('  solve rsa attack <attack-type> [args...] - Run RSA attack'));
        break;
      case 'exploitation':
        console.log(chalk.blue.bold('Exploitation solver commands:'));
        console.log(chalk.yellow('  solve exploitation rop - Generate ROP chain'));
        console.log(chalk.yellow('  solve exploitation shellcode - Generate shellcode'));
        console.log(chalk.yellow('  solve exploitation bufferoverflow - Generate buffer overflow payload'));
        break;
      case 'math':
        console.log(chalk.blue.bold('Math solver commands:'));
        console.log(chalk.yellow('  solve math gcd <a> <b> - Calculate GCD'));
        console.log(chalk.yellow('  solve math lcm <a> <b> - Calculate LCM'));
        console.log(chalk.yellow('  solve math isprime <n> - Check if number is prime'));
        console.log(chalk.yellow('  solve math factorize <n> - Factorize number'));
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
    switch (forensicsType) {
      case 'binary':
        console.log(chalk.blue.bold('Binary forensics commands:'));
        console.log(chalk.yellow('  forensics binary analyze <file> - Analyze binary file'));
        console.log(chalk.yellow('  forensics binary search <file> <pattern> - Search pattern in binary'));
        console.log(chalk.yellow('  forensics binary extract <file> <offset> <length> - Extract region from binary'));
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

