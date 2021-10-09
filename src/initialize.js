const WebCrawler = require('./web.crawler');

function initialize(urlString, options) {
    var numOfWorkers = parseInt(options['n']);
    const workerFile = './src/web.crawler.worker.js';
    const webCrawler = new WebCrawler({
        urlString,
        numOfWorkers,
        workerFile
    });

    webCrawler.crawl();
}

module.exports = initialize;
