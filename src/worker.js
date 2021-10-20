const workerThreads = require('worker_threads');
const WebCrawlerWorker = require('./web.crawler.worker')

function init() {
    if (workerThreads.parentPort) {
        workerThreads.parentPort.once('message', () => {
            webCrawlerWorker = new WebCrawlerWorker({workerThreads}) 
        })
        workerThreads.parentPort.on('message', (data) => {
            webCrawlerWorker.visitPageAndCollectLinks(data.processedBaseUrlHostName, data.urlString);
        });
    }
}

init();

module.exports = init;