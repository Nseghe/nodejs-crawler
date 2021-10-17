const initialize = require('../.././bin/index')
const WebCrawlerMain = require('../.././src/web.crawler.main');

jest.mock('../../src/web.crawler.main');

describe('init', function() {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, 'error').mockReturnValue();
	});
	afterEach(() => {
		process.argv = process.argv.slice(0, 2);
	});

	test('initializes the main thread when correct inputs are provided', function() {
		// Arrange
		process.argv[2] = '-n';
		process.argv[3] = '3';
		process.argv[4] = 'https://www.testwebsite.com/';

        // Act
        initialize(process.argv);

        // Assert
        expect(console.error.mock.calls.length).toBe(0);
	});
	test('throws error when "-n" flag is not provided', function() {
		// Arrange
		process.argv[2] = 'https://www.testwebsite.com/';

        // Act
        initialize(process.argv);

        // Assert
        expect(console.error.mock.calls.length).toBe(1);
	});
	test('throws error when "-n" flag value is not provided', function() {
		// Arrange
		process.argv[2] = '-n';
		process.argv[3] = 'https://www.testwebsite.com/';

        // Act
        initialize(process.argv);

        // Assert
        expect(console.error.mock.calls.length).toBe(1);
	});
	test('throws error when url to be crawled is not provided', function() {
		// Arrange
		process.argv[2] = '-n';
		process.argv[3] = '3';

        // Act
        initialize(process.argv);

        // Assert
        expect(console.error.mock.calls.length).toBe(1);
	});
	test('throws error when incomplete/incorrect url is provided', function() {
		// Arrange
		process.argv[2] = '-n';
		process.argv[3] = '3';
		process.argv[4] = 'invalid_url';

        // Act
        initialize(process.argv);

        // Assert
        expect(console.error.mock.calls.length).toBe(1);
	});
})