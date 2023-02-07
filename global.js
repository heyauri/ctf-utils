#!/usr/bin/env node

const { Command } = require('commander');
const lib = require("./lib");
const program = new Command();
const chalk = require('chalk');

program
    .name('ctf-util')
    .description('CLI to some ctf utilities')
    .version('0.1.0');

program
    .command("detect <Input>")
    .action((Input) => {
        console.log(chalk.bgBlue(Input), ` is likely to be encoded as:`);
        let result = lib.detect.detectAll(Input);
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
    })

program.parse();