const worker_threads = require('worker_threads');
const init = require('../../src/worker');
require('../../src/web.crawler.worker');

jest.mock('worker_threads');
jest.mock('../../src/web.crawler.worker');

describe('init', function() {
    test('Initializes the worker thread when a message is recieved from the main thread', function() {
        // Arrange
        data = {
            'processedBaseUrlHostName': 'testwebsite.com',
            'urlString': 'https://testwebsite.com/'
        }
        worker_threads.parentPort = {
            'on': jest.fn((string, callback) => {
                return callback(data);
            }),
            'once': jest.fn((string, callback) => {
                return callback();
            })
        }

        // Act
        result = init();

        // Assert
        expect(worker_threads.parentPort.on.mock.calls.length).toBe(1);
        expect(worker_threads.parentPort.once.mock.calls.length).toBe(1);
    });
});