const worker_threads = require('worker_threads');
const WebCrawlerMain = require('../../src/web.crawler.main');

jest.mock('axios');
jest.mock('worker_threads');

describe('WebCrawlerWorker', function() {

	describe('visitPageAndCollectLinks', function() {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		test('Processes absolute links correctly when in the same domain', function() {
			// Arrange
			const urlString = 'https://www.testwebsite.com/';
			const response = {
				'status': 200,
				'request': { 'res': { 'responseUrl': urlString } },
				'data': `<div>
							<a href='http://www.testwebsite.com/images'>ImagesHttp</a>
							<a href='http://maps.testwebsite.com/maps'>MapsHttp</a>
							<a href='https://www.testwebsite.com/images'>ImagesHttps</a>
							<a href='https://maps.testwebsite.com/maps'>MapsHttps</a>
						</div>`
			}
			worker_threads.parentPort = {
				'postMessage': jest.fn()
			}
			const processedBaseUrlHostName = 'testwebsite.com';
			axios.get.mockImplementation( () => Promise.resolve(response) );
			const webCrawlerWorker = new WebCrawlerWorker({ workerThreads: worker_threads });
			const _collectLinksMock = jest.spyOn(webCrawlerWorker, '_collectLinks');
			const _getAbsoluteLinksMock = jest.spyOn(webCrawlerWorker, '_getAbsoluteLinks');
			const _getRelativeLinksMock = jest.spyOn(webCrawlerWorker, '_getRelativeLinks');
	
			// Act
			result = webCrawlerWorker.visitPageAndCollectLinks(processedBaseUrlHostName, urlString);
	
			// Assert
			result.then(
				() => {
					expect(axios.get.mock.calls.length).toBe(1);
					expect(_collectLinksMock.mock.calls.length).toBe(1);
					expect(_getAbsoluteLinksMock.mock.calls.length).toBe(1);
					expect(_getRelativeLinksMock.mock.calls.length).toBe(1);
					expect(worker_threads.parentPort.postMessage.mock.calls.length).toBe(5);
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('http://www.testwebsite.com/images');
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('http://maps.testwebsite.com/maps');
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('https://www.testwebsite.com/images');
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('https://maps.testwebsite.com/maps');
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('completed');
				}
			)
		});
		
	});
})
