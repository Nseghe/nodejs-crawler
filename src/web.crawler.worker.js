const axios = require('axios');
const cheerio = require('cheerio');
const URL = require('url-parse');
const { parentPort } = require('worker_threads');

function checkDomain(baseUrl, urlString) {
    var url = new URL(urlString);
    if (url.hostname == baseUrl.hostname) {
        return true;
    }
    return false;
}

function collectInternalLinks($, baseUrl) {
    var relativeLinks = $("a[href^='/']");
    var absoluteLinks = $("a[href^='http']");
    relativeLinks.each(function() {
        var urlString = baseUrl.protocol + "//" + baseUrl.hostname + $(this).attr('href');
        console.log(urlString);
        parentPort.postMessage(urlString);
    })
    absoluteLinks.each(function() {
        var urlString = $(this).attr('href');
        if (checkDomain(baseUrl, urlString)) {
            parentPort.postMessage(urlString);
        }
    })
    parentPort.postMessage('completed');
}

function visitPage(baseUrl, urlString) {
    axios.get(urlString, {
        maxRedirects: 10
    })
    .then((response) => {
        if (response.status != 200) {
            parentPort.postMessage('completed');
            return;
        }
        var $ = cheerio.load(response.data);
        collectInternalLinks($, baseUrl);
    })
    .catch((error) => {
        parentPort.postMessage('completed');
    })
}

parentPort.on('message', (data) => {
    visitPage(data.baseUrl, data.urlString);
});


module.exports = {
    checkDomain,
    collectInternalLinks,
    visitPage
}