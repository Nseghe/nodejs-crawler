# nodejs-crawler

## Usage
1. Clone this repository or download the files.
2. Run the following command from the root folder to install all dependencies and install the command line tool globally:

```
npm install && npm install -g
```

3. Run the tests with:

```
npm test
```

4. Use the tool from the command line as follows:

```
crawl -n 3 https://www.testwebsite.com
```

    - The -n flag specifies the number of workers used in crawling (in this case - 3).
    - The last value is the website to be crawled (in this case - https://www.testwebsite.com)
