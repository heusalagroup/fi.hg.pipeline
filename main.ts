#!/usr/bin/env node

const Runner = require("./Runner");
const PATH = require('path');
const PROCESS = require('process');
const LogService = require("../ts/LogService");

const LOG = LogService.createLogger('main');

const args : string[] = PROCESS.argv;

args.shift();

const cwd = PROCESS.cwd();
const script : string = PATH.relative( cwd, PATH.basename( args.shift() ) );

LOG.debug('script = ', script);
LOG.debug('args = ', args);
LOG.debug('cwd = ', cwd);

Runner.main(script, args).then((status : number) => {
    LOG.debug('status = ', status);
    PROCESS.exit(status);
}).catch((err : any) => {
    LOG.error(`Error: `, err);
    PROCESS.exit(1);
});
