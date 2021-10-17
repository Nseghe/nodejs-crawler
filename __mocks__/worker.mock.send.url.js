const workerThreads = require('worker_threads');

if (workerThreads.parentPort) {
    workerThreads.parentPort.on('message', (data) => {
        workerThreads.parentPort.postMessage(data.urlString);
    });
}