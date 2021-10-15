#! /usr/bin/env node

const { URL } = require('url');
const WebCrawlerMain = require('../src/web.crawler.main');

var IS_EXECUTING = (require.main === module);

function init(args) {
    try {
        const nRequired = 'Invalid Syntax. Please specify the number of worker threads to be used for crawling using the -n flag.\n' +
                            'For eg.: crawl -n 3 http://example.com will use 3 worker threads to crawl http://example.com.'
        const urlRequired = 'Invalid Syntax. Please specify the url to be crawled. \nFor example: crawl -n 3 http://example.com will use ' +
                            '3 worker threads to crawl http://example.com.'
        const numOfWorkers = parseInt(args[3]);
        const urlString = args[4];

        if (args[2] != '-n' || !numOfWorkers)
            throw SyntaxError(nRequired);
        if (!args[4])
            throw SyntaxError(urlRequired);
        const baseUrl = new URL(urlString);
        const workerFile = './src/worker.js';
        const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
        webCrawlerMain.crawl();
    } catch (e) {
        if (e instanceof SyntaxError)
            console.error(e.message);
        else {
            const invalidUrl = e.message + '. \nPlease specify a complete URL. For eg.: "http://example.com" or "http://www.example.com".';
            console.error(invalidUrl);
        }
    }
}

if (IS_EXECUTING)
    init(process.argv);
else
    module.exports = init;
