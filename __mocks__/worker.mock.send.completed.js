const workerThreads = require('worker_threads');

workerThreads.parentPort.on('message', (data) => {
    workerThreads.parentPort.postMessage('completed');
})