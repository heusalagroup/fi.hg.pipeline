#!/usr/bin/env node

const RunnerModule = require('./Runner');
const Runner = RunnerModule?.default ?? RunnerModule.Runner ?? RunnerModule;

Runner.main(process.argv).then((status : number) => {
    process.exit(status);
}).catch((err : any) => {
    console.error(`Error: `, err);
    process.exit(1);
});
