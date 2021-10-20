const WebCrawlerMain = require('../../src/web.crawler.main');

describe('WebCrawlerMain', function() {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    describe('addNewWorker', function() {
        test('Sets firstCrawl to false and starts another crawl when worker sends "completed"', done => {
            // Arrange
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 1;
            const workerFile = './__mocks__/worker.mock.send.completed.js';
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            const crawlMock = jest.spyOn(webCrawlerMain, 'crawl').mockReturnValue();
            const worker = webCrawlerMain.freeWorkers.pop();
            
            // Act
            worker.postMessage({ urlString: 'https://www.testwebsite.com/' });

			// Assert
            setTimeout(() => {
                expect(webCrawlerMain.firstCrawl).toStrictEqual(false);
                expect(crawlMock.mock.calls.length).toBe(1);
                done();
                worker.terminate(); // Tear down
            }, 100);
        });
        test('calls processWorkerResult when worker sends url', done => {
            // Arrange
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 1;
            const workerFile = './__mocks__/worker.mock.send.url.js';
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            const processWorkerResultMock = jest.spyOn(webCrawlerMain, 'processWorkerResult').mockReturnValue();
            const worker = webCrawlerMain.freeWorkers.pop();
            
            // Act
            worker.postMessage({ urlString: 'https://www.testwebsite.com/' });

			// Assert
            setTimeout(() => {
                expect(webCrawlerMain.firstCrawl).toStrictEqual(true);
                expect(processWorkerResultMock.mock.calls.length).toBe(1);
                done();
                worker.terminate(); // Tear down
            }, 100);
        });
    });
})