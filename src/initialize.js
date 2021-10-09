const WebCrawler = require('./web.crawler');

function initialize(urlString, options) {
    var numOfWorkers;
    if ('n' in options) {
        numOfWorkers = parseInt(options['n']);
    } else {
        numOfWorkers = 1;
    }
    
    const workerFile = './src/web.crawler.worker.js';
    const webCrawler = new WebCrawler({
        urlString,
        numOfWorkers,
        workerFile
    });
    
    webCrawler.crawl();
}

module.exports = initialize;
