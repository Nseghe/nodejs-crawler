#! /usr/bin/env node

const { program } = require('commander')
const initialize = require('./initialize')

program
    .version('0.1.0')
    .description('Crawl the given website and print out all links')
    .argument('<urlString>', 'Website to crawl')
    .option('-n <n>', 'Number of workers crawling in parallel. If not specified, one worker is used', 1)
    .action(initialize)

program.parse(process.argv);
