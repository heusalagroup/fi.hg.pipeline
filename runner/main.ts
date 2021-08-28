#!/usr/bin/env node

const mainModule = require('./MainFunction');
const main = mainModule?.default ?? mainModule.main ?? mainModule;

main(process.argv).then((status : number) => {
    process.exit(status);
}).catch((err : any) => {
    console.error(`Error: `, err);
    process.exit(1);
});
