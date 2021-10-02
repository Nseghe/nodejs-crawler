#! /usr/bin/env node

const { program } = require('commander')
const crawl = require('./web.crawler')

program
    .version('0.1.0')
    .description('Crawl the given website and print out all links')
    .command('crawl <urlString>')
    .option('-n [n]', 'Number of workers crawling in parallel. If not specified, one worker is used')
    .action(crawl)

program.parse(process.argv);
