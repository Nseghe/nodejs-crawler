const { Worker } = require('worker_threads');

class WebCrawlerMain {
    constructor({ baseUrl, numOfWorkers, workerFile }) {
        this.processedBaseUrlHostName = this.processUrlStringForStorage(baseUrl.hostname);
        this.numOfWorkers = numOfWorkers;
        this.workerFile = workerFile;
        this.pagesToVisit = [baseUrl.href];
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
            const urlString = this.pagesToVisit.pop();
            const processedUrlString = this.processUrlStringForStorage(urlString);
            this.pagesVisited[processedUrlString] = true;
            console.log(urlString);
            this.runTask({
                urlString: urlString,
                processedBaseUrlHostName: this.processedBaseUrlHostName
            });            
        }
        
        this.TerminateWorkersAndExitProcessIfCrawlComplete();
    }

    runTask(task) {
        const worker = this.freeWorkers.pop();
        worker.postMessage(task);
    }

    processUrlStringForStorage(urlString) {
        urlString = urlString.replace(/(https?:\/\/)?(?:www\.)?/i, '');
        urlString = (urlString.slice(-1) === '/') ? urlString.slice(0, -1) : urlString;
        return urlString;
    }

    processWorkerResult(result) {
        const processedResult = this.processUrlStringForStorage(result);
        if (this.pagesVisited[processedResult] === undefined) {
            this.pagesVisited[processedResult] = false;
            this.pagesToVisit.push(result);
        }
    }

    TerminateWorkersAndExitProcessIfCrawlComplete() {
        if (!this.firstCrawl && this.freeWorkers.length === this.numOfWorkers &&
            this.pagesToVisit.length === 0) {
                for (const worker of this.freeWorkers)
                    worker.terminate();
                process.exit(0);
        }
    }
}

module.exports = WebCrawlerMain;
