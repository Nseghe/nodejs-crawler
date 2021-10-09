const URL = require('url-parse');
const { Worker } = require('worker_threads');

class WebCrawler {
    constructor({ urlString, numOfWorkers, workerFile }) {
        this.baseUrl = new URL(urlString);
        this.numOfWorkers = numOfWorkers;
        this.workerFile = workerFile;
        this.pagesToVisit = [urlString];
        this.pagesVisited = {};
        this.freeWorkers = [];
        this.firstCrawl = true;

        for (let i = 0; i < this.numOfWorkers; i++) {
            this.addNewWorker();
        }
    }

    addNewWorker() {
        const worker = new Worker(this.workerFile);
        worker.on('message', (result) => {
            if (result === 'completed') {
                this.freeWorkers.push(worker);
                this.firstCrawl = false;
                this.crawl();
            } else
                return this.processWorkerResult(result);
        });

        this.freeWorkers.push(worker);
    }

    crawl() {
        while (this.pagesToVisit.length > 0 && this.freeWorkers.length > 0) {
            var urlString = this.pagesToVisit.pop();
            this.pagesVisited[urlString] = true;
            console.log(urlString);
            this.runTask({ 'baseUrl': this.baseUrl, 'urlString': urlString });            
        }
        
        this.TerminateWorkersIfCrawlComplete();
    }

    runTask(task) {
        const worker = this.freeWorkers.pop();
        worker.postMessage(task);
    }

    TerminateWorkersIfCrawlComplete() {
        if (!this.firstCrawl && this.freeWorkers.length === this.numOfWorkers &&
            this.pagesToVisit.length === 0) {
                this.close();
        }
    }

    processWorkerResult(result) {
        if (this.pagesVisited[result] === undefined) {
            this.pagesVisited[result] = false;
            this.pagesToVisit.push(result);
        }
    }

    close() {
        for (const worker of this.freeWorkers) worker.terminate();
    }
}

module.exports = WebCrawler;