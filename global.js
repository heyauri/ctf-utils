#!/usr/bin/env node

const { Command } = require('commander');
const lib = require("./lib");
const program = new Command();

program
    .name('ctf-util')
    .description('CLI to some ctf utilities')
    .version('0.1.0');

program
    .command("detect <Input>")
    .action((Input) => {
        console.log(`${Input} is likely to be encoded as:`);
        console.log(`${lib.detect.detectAll(Input).join("\n")}`);
    })

program.parse();