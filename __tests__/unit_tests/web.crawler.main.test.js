const WebCrawlerMain = require('../../src/web.crawler.main');

jest.mock('worker_threads');

describe('WebCrawlerMain', function() {
    beforeEach(() => {
        jest.clearAllMocks();
    });

	describe('constructor', function() {
		test('Initializes new worker threads according to value of numOfWorkers', function() {
			// Arrange
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';

            // Act
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
	
			// Assert
            expect(webCrawlerMain.freeWorkers.length).toBe(numOfWorkers);
		});
    });

    describe('crawl', function() {
        test('Does not crawl if no free workers are available', function() {
			// Arrange
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            webCrawlerMain.pagesToVisit = [
                'https://www.testwebsite0.com/',
                'https://www.testwebsite1.com/',
                'https://www.testwebsite2.com/'
            ];
            webCrawlerMain.freeWorkers = [];
            const processUrlStringForStorageMock = jest.spyOn(webCrawlerMain, 'processUrlStringForStorage');
            const runTaskMock = jest.spyOn(webCrawlerMain, 'runTask').mockReturnValue();
            const TerminateWorkersAndExitProcessIfCrawlCompleteMock = jest.spyOn(
                webCrawlerMain, 'TerminateWorkersAndExitProcessIfCrawlComplete'
            ).mockReturnValue();
            jest.spyOn(console, 'log').mockReturnValue();
            
            // Act
            webCrawlerMain.crawl();

			// Assert
            expect(runTaskMock.mock.calls.length).toBe(0);
            expect(processUrlStringForStorageMock.mock.calls.length).toBe(0);
            expect(console.log.mock.calls.length).toBe(0);
            expect(TerminateWorkersAndExitProcessIfCrawlCompleteMock.mock.calls.length).toBe(1);
		});
        test('Does not crawl if no there are no pages to visit', function() {
			// Arrange
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            webCrawlerMain.pagesToVisit = [];
            webCrawlerMain.freeWorkers = [ 'worker1', 'worker2', 'worker3' ];
            const processUrlStringForStorageMock = jest.spyOn(webCrawlerMain, 'processUrlStringForStorage');
            const runTaskMock = jest.spyOn(webCrawlerMain, 'runTask').mockReturnValue();
            const TerminateWorkersAndExitProcessIfCrawlCompleteMock = jest.spyOn(
                webCrawlerMain, 'TerminateWorkersAndExitProcessIfCrawlComplete'
            ).mockReturnValue();
            jest.spyOn(console, 'log').mockReturnValue();
            
            // Act
            webCrawlerMain.crawl();

			// Assert
            expect(runTaskMock.mock.calls.length).toBe(0);
            expect(processUrlStringForStorageMock.mock.calls.length).toBe(0);
            expect(console.log.mock.calls.length).toBe(0);
            expect(TerminateWorkersAndExitProcessIfCrawlCompleteMock.mock.calls.length).toBe(1);
		});
        test('Distributes load across workers, prints and stores visited urls correctly', function() {
			// Arrange
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            webCrawlerMain.pagesToVisit = [
                'https://www.testwebsite0.com/',
                'https://www.testwebsite1.com/',
                'https://www.testwebsite2.com/'
            ];
            webCrawlerMain.freeWorkers = [ 'worker1', 'worker2', 'worker3' ];
            const processUrlStringForStorageMock = jest.spyOn(webCrawlerMain, 'processUrlStringForStorage')
            .mockReturnValueOnce('testwebsite0.com')
            .mockReturnValueOnce('testwebsite1.com')
            .mockReturnValueOnce('testwebsite2.com');
            const runTaskMock = jest.spyOn(webCrawlerMain, 'runTask').mockReturnValue();
            const TerminateWorkersAndExitProcessIfCrawlCompleteMock = jest.spyOn(
                webCrawlerMain, 'TerminateWorkersAndExitProcessIfCrawlComplete'
            ).mockReturnValue();
            jest.spyOn(console, 'log').mockReturnValue();
            
            // Act
            webCrawlerMain.crawl();

			// Assert
            expect(runTaskMock.mock.calls.length).toBe(numOfWorkers);
            expect(runTaskMock).toHaveBeenCalledWith({
                urlString: 'https://www.testwebsite0.com/',
                processedBaseUrlHostName: 'testwebsite.com'
            });
            expect(runTaskMock).toHaveBeenCalledWith({
                urlString: 'https://www.testwebsite1.com/',
                processedBaseUrlHostName: 'testwebsite.com'
            });
            expect(runTaskMock).toHaveBeenCalledWith({
                urlString: 'https://www.testwebsite2.com/',
                processedBaseUrlHostName: 'testwebsite.com'
            });
            expect(webCrawlerMain.pagesVisited).toStrictEqual({
                'testwebsite0.com': true,
                'testwebsite1.com': true,
                'testwebsite2.com': true
            });
            expect(processUrlStringForStorageMock.mock.calls.length).toBe(numOfWorkers);
            expect(processUrlStringForStorageMock).toHaveBeenCalledWith('https://www.testwebsite0.com/');
            expect(processUrlStringForStorageMock).toHaveBeenCalledWith('https://www.testwebsite1.com/');
            expect(processUrlStringForStorageMock).toHaveBeenCalledWith('https://www.testwebsite2.com/');
            expect(console.log.mock.calls.length).toBe(numOfWorkers);
            expect(console.log).toHaveBeenCalledWith('https://www.testwebsite0.com/');
            expect(console.log).toHaveBeenCalledWith('https://www.testwebsite1.com/');
            expect(console.log).toHaveBeenCalledWith('https://www.testwebsite2.com/');
            expect(TerminateWorkersAndExitProcessIfCrawlCompleteMock.mock.calls.length).toBe(1);
		});
    });

    describe('runTask', function() {
        test('sends the task details to one of the available workers', function() {
			// Arrange
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';
            const worker = {
                postMessage: jest.fn()
            }
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            webCrawlerMain.freeWorkers = [ worker ];
            
            // Act
            webCrawlerMain.runTask('task');
            
			// Assert
            expect(worker.postMessage.mock.calls.length).toBe(1);
			expect(worker.postMessage).toHaveBeenCalledWith('task');
		});
	});

    describe('processUrlStringForStorage', function() {
        test('Removes "http/https://", "www." and trailing slash from inputted url', function() {
            // Arrange
            const urlString = 'https://www.testwebsite.com/';
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });

            // Act
            const result = webCrawlerMain.processUrlStringForStorage(urlString);

            // Assert
            expect(result).toBe('testwebsite.com');
        });
    });

    describe('processWorkerResult', function() {
        test('Adds url to pagesToVisit and sets url value to false in pagesVisited if not already visited', function() {
            // Arrange
            const urlString = 'https://www.testwebsite.com/';
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            const processUrlStringForStorageMock = jest.spyOn(webCrawlerMain, 'processUrlStringForStorage')
            .mockReturnValueOnce('testwebsite.com')
            webCrawlerMain.pagesToVisit = [];

            // Act
            webCrawlerMain.processWorkerResult(urlString);

            // Assert
            expect(webCrawlerMain.pagesToVisit).toStrictEqual(['https://www.testwebsite.com/']);
            expect(webCrawlerMain.pagesVisited['testwebsite.com']).toStrictEqual(false);
            expect(processUrlStringForStorageMock.mock.calls.length).toBe(1);
            expect(processUrlStringForStorageMock).toHaveBeenCalledWith('https://www.testwebsite.com/');
        });
        test('does not add url to pagesToVisit and does not set url value in pagesVisited if already visited', function() {
            // Arrange
            const urlString = 'https://www.testwebsite.com/';
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            const processUrlStringForStorageMock = jest.spyOn(webCrawlerMain, 'processUrlStringForStorage')
            .mockReturnValueOnce('testwebsite.com')
            webCrawlerMain.pagesToVisit = [];
            webCrawlerMain.pagesVisited['testwebsite.com'] = true;

            // Act
            webCrawlerMain.processWorkerResult(urlString);

            // Assert
            expect(webCrawlerMain.pagesToVisit).toStrictEqual([]);
            expect(processUrlStringForStorageMock.mock.calls.length).toBe(1);
            expect(processUrlStringForStorageMock).toHaveBeenCalledWith('https://www.testwebsite.com/');
        });
    });

    describe('TerminateWorkersAndExitProcessIfCrawlComplete', function() {
        test('Terminates workers and exits process if all workers are free and there are no pages to be visited', function() {
            // Arrange
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';
            const worker1 = {
                terminate: jest.fn()
            }
            const worker2 = {
                terminate: jest.fn()
            }
            const worker3 = {
                terminate: jest.fn()
            }
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            const processUrlStringForStorageMock = jest.spyOn(webCrawlerMain, 'processUrlStringForStorage')
            .mockReturnValueOnce('testwebsite.com');
            webCrawlerMain.firstCrawl = false;
            webCrawlerMain.pagesToVisit = [];
            webCrawlerMain.freeWorkers = [ worker1, worker2, worker3 ];
            jest.spyOn(process, 'exit').mockReturnValue();

            // Act
            webCrawlerMain.TerminateWorkersAndExitProcessIfCrawlComplete();

            // Assert
            expect(worker1.terminate.mock.calls.length).toBe(1);
            expect(worker2.terminate.mock.calls.length).toBe(1);
            expect(worker3.terminate.mock.calls.length).toBe(1);
            expect(process.exit.mock.calls.length).toBe(1);
            expect(process.exit).toHaveBeenCalledWith(0);
        });
        test('Does not terminate workers and exit process if there are still pages to be visited', function() {
            // Arrange
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';
            const worker1 = {
                terminate: jest.fn()
            }
            const worker2 = {
                terminate: jest.fn()
            }
            const worker3 = {
                terminate: jest.fn()
            }
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            const processUrlStringForStorageMock = jest.spyOn(webCrawlerMain, 'processUrlStringForStorage')
            .mockReturnValueOnce('testwebsite.com');
            webCrawlerMain.firstCrawl = false;
            webCrawlerMain.pagesToVisit = [
                'https://www.testwebsite0.com/',
                'https://www.testwebsite1.com/',
                'https://www.testwebsite2.com/'
            ];
            webCrawlerMain.freeWorkers = [ worker1, worker2, worker3 ];
            jest.spyOn(process, 'exit').mockReturnValue();

            // Act
            webCrawlerMain.TerminateWorkersAndExitProcessIfCrawlComplete();

            // Assert
            expect(worker1.terminate.mock.calls.length).toBe(0);
            expect(worker2.terminate.mock.calls.length).toBe(0);
            expect(worker3.terminate.mock.calls.length).toBe(0);
            expect(process.exit.mock.calls.length).toBe(0);
        });
        test('Does not terminate workers and exit process if there are still running workers', function() {
            // Arrange
            const baseUrl = {
                host: 'www.testwebsite.com',
                hostname: 'www.testwebsite.com',
                href: 'https://www.testwebsite.com/',
                protocol: 'https:'
            };
            const numOfWorkers = 3;
            const workerFile = 'worker_file_location';
            const worker1 = {
                terminate: jest.fn()
            }
            const worker2 = {
                terminate: jest.fn()
            }
            const worker3 = {
                terminate: jest.fn()
            }
            const webCrawlerMain = new WebCrawlerMain({ baseUrl, numOfWorkers, workerFile });
            const processUrlStringForStorageMock = jest.spyOn(webCrawlerMain, 'processUrlStringForStorage')
            .mockReturnValueOnce('testwebsite.com');
            webCrawlerMain.firstCrawl = false;
            webCrawlerMain.pagesToVisit = [];
            webCrawlerMain.freeWorkers = [];
            jest.spyOn(process, 'exit').mockReturnValue();

            // Act
            webCrawlerMain.TerminateWorkersAndExitProcessIfCrawlComplete();

            // Assert
            expect(worker1.terminate.mock.calls.length).toBe(0);
            expect(worker2.terminate.mock.calls.length).toBe(0);
            expect(worker3.terminate.mock.calls.length).toBe(0);
            expect(process.exit.mock.calls.length).toBe(0);
        });
    });
})
