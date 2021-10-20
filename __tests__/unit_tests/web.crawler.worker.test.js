const axios = require('axios');
const worker_threads = require('worker_threads');
const WebCrawlerWorker = require('../../src/web.crawler.worker');

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
		test('Rejects absolute links when in different domain', function() {
			// Arrange
			const urlString = 'https://www.testwebsite.com/';
			const response = {
				'status': 200,
				'request': { 'res': { 'responseUrl': urlString } },
				'data': `<div>
							<a href='http://www.nottestwebsite.com/images'>ImagesHttp</a>
							<a href='http://maps.nottestwebsite.com/maps'>MapsHttp</a>
							<a href='https://www.nottestwebsite.com/images'>ImagesHttps</a>
							<a href='https://maps.nottestwebsite.com/maps'>MapsHttps</a>
						</div>`
			}
			worker_threads.parentPort = {
				'postMessage': jest.fn()
			}
			const processedBaseUrlHostName = 'testwebsite.com';
			axios.get.mockImplementation( () => Promise.resolve(response) );
			const webCrawlerWorker = new WebCrawlerWorker({ workerThreads: worker_threads });
			const _collectLinksMock = jest.spyOn(webCrawlerWorker, '_collectLinks')
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
					expect(worker_threads.parentPort.postMessage.mock.calls.length).toBe(1);
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('completed');
				}
			)
		});
		test('Processes relative links correctly when base url host name contains "www"', function() {
			// Arrange
			const urlString = 'https://www.testwebsite.com/';
			const response = {
				'status': 200,
				'request': { 'res': { 'responseUrl': urlString } },
				'data': `<div>
							<a href='/preferences'>Settings</a>
						</div>`
			}
			worker_threads.parentPort = {
				'postMessage': jest.fn()
			}
			const processedBaseUrlHostName = 'testwebsite.com';
			axios.get.mockImplementation( () => Promise.resolve(response) );
			const webCrawlerWorker = new WebCrawlerWorker({ workerThreads: worker_threads });
			const _collectLinksMock = jest.spyOn(webCrawlerWorker, '_collectLinks')
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
					expect(worker_threads.parentPort.postMessage.mock.calls.length).toBe(2);
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('https://www.testwebsite.com/preferences');
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('completed');
				}
			)
		});
		test('Processes relative links correctly when base url hostname does not contain "www"', function() {
			// Arrange
			const urlString = 'https://testwebsite.com/';
			const response = {
				'status': 200,
				'request': { 'res': { 'responseUrl': urlString } },
				'data': `<div>
							<a href='/preferences'>Settings</a>
						</div>`
			}
			worker_threads.parentPort = {
				'postMessage': jest.fn()
			}
			const processedBaseUrlHostName = 'testwebsite.com';
			axios.get.mockImplementation( () => Promise.resolve(response) );
			const webCrawlerWorker = new WebCrawlerWorker({ workerThreads: worker_threads });
			const _collectLinksMock = jest.spyOn(webCrawlerWorker, '_collectLinks')
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
					expect(worker_threads.parentPort.postMessage.mock.calls.length).toBe(2);
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('https://testwebsite.com/preferences');
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('completed');
				}
			)
		});
		test('Rejects relative links when base url is is a different domain', function() {
			// Arrange
			const urlString = 'https://nottestwebsite.com/';
			const response = {
				'status': 200,
				'request': { 'res': { 'responseUrl': urlString } },
				'data': `<div>
							<a href='/preferences'>Settings</a>
						</div>`
			}
			worker_threads.parentPort = {
				'postMessage': jest.fn()
			}
			const processedBaseUrlHostName = 'testwebsite.com';
			axios.get.mockImplementation( () => Promise.resolve(response) );
			const webCrawlerWorker = new WebCrawlerWorker({ workerThreads: worker_threads });
			const _collectLinksMock = jest.spyOn(webCrawlerWorker, '_collectLinks')
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
					expect(worker_threads.parentPort.postMessage.mock.calls.length).toBe(1);
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('completed');
				}
			)
		});
		test('Sends "completed" to parent thread when response status is != 200', function() {
			// Arrange
			const response = {
				'status': 404,
				'request': { 'res': { 'responseUrl': 'https://testwebsite.com/' } },
				'data': 'response data'
			}
			worker_threads.parentPort = {
				'postMessage': jest.fn()
			}
			const processedBaseUrlHostName = 'testwebsite.com';
			const urlString = 'https://testwebsite.com/';
			axios.get.mockImplementation( () => Promise.resolve(response) );
			const webCrawlerWorker = new WebCrawlerWorker({ workerThreads: worker_threads });
			
			// Act
			result = webCrawlerWorker.visitPageAndCollectLinks(processedBaseUrlHostName, urlString);
	
			// Assert
			result.then(
				() => {
					expect(worker_threads.parentPort.postMessage.mock.calls.length).toBe(1);
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('completed');
				}
			)
		});
		test('Sends "completed" to parent thread when get request returns an error', function() {
			// Arrange
			worker_threads.parentPort = {
				'postMessage': jest.fn()
			}
			const processedBaseUrlHostName = 'testwebsite.com';
			const urlString = 'https://testwebsite.com/';
			axios.get.mockImplementation( () => Promise.reject() );
			const webCrawlerWorker = new WebCrawlerWorker({ workerThreads: worker_threads });
			
			// Act
			result = webCrawlerWorker.visitPageAndCollectLinks(processedBaseUrlHostName, urlString);
	
			// Assert
			result.catch(
				() => {
					expect(worker_threads.parentPort.postMessage.mock.calls.length).toBe(1);
					expect(worker_threads.parentPort.postMessage).toHaveBeenCalledWith('completed');
				}
			)
		});
	});
})
