const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

class WebCrawlerWorker {
    constructor ({workerThreads}) {
        this.workerThreads = workerThreads;
    }

    visitPageAndCollectLinks(processedBaseUrlHostName, urlString) {
        const self = this;
        const config = { 
            maxRedirects: 20
        }
        return axios.get(urlString, config)
        .then((response) => {
            if (response.status != 200) {
                return self.workerThreads.parentPort.postMessage('completed');
            }
            const baseUrl = response.request.res.responseUrl;
            const $ = cheerio.load(response.data);
            return self._collectLinks($, processedBaseUrlHostName, baseUrl);
        })
        .catch((error) => {
            return self.workerThreads.parentPort.postMessage('completed');
        })
    }
    
    _collectLinks($, processedBaseUrlHostName, baseUrl) {
        this._getAbsoluteLinks($, processedBaseUrlHostName);
        this._getRelativeLinks($, processedBaseUrlHostName, baseUrl);
        this.workerThreads.parentPort.postMessage('completed');
    }
    
    _getAbsoluteLinks($, processedBaseUrlHostName) {
        const self = this;
        const absoluteLinks = $('a').filter(function() {
            return $(this).attr('href').includes('.' + processedBaseUrlHostName);
        });
        absoluteLinks.each(function() {
            const urlString = $(this).prop('href');
            self.workerThreads.parentPort.postMessage(urlString);
        });
    }
    
    _getRelativeLinks($, processedBaseUrlHostName, baseUrl) {
        const self = this;
        const relativeLinks = $("a[href^='/'], a[href^='./'], a[href^='../']");
        relativeLinks.each(function() {
            const urlString = new URL($(this).attr('href'), baseUrl);
            if (urlString.hostname === processedBaseUrlHostName ||
                urlString.hostname.includes('.' + processedBaseUrlHostName)) {
                self.workerThreads.parentPort.postMessage(urlString.href);
            }
        });
    }
}

module.exports = WebCrawlerWorker;