const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const WebCrawlerHelper = require('./web.crawler.helper.js');

function crawl (urlString, opts) {
    if ('n' in opts) {
        numOfWorkers = opts['n'];
    } else {
        numOfWorkers = 1;
    }

    console.log(numOfWorkers);
    const webCrawlerHelper = new WebCrawlerHelper({
        urlString,
        URL,
        request,
        cheerio
    });

    webCrawlerHelper.crawl();
}

module.exports = crawl;
