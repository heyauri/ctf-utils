#!/usr/bin/env node

const { Command } = require('commander');
const { encode, decode, detectAll, encodeSync, decodeSync, detectAllSync } = require("./lib");
const program = new Command();
const chalk = require('chalk');

program
    .name('ctf-util')
    .description('CLI to some ctf utilities')
    .version('0.1.0');

async function detectAction(Input) {
    console.log(chalk.bgBlue(Input), ` is likely to be encoded as:`);
    let result = await detectAll(Input);
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
}

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

program.parse();
