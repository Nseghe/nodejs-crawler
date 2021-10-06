const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const URL = require('url-parse');
const WebCrawlerHelper = require('../../src/web.crawler.helper.js');

describe('webCrawlerHelper', function() {

    const urlString = 'https://www.google.com/';
    const request = ({}, callback) => {
        return callback(
            false,
            { 'statuscode': 200 },
            {}
        );
    };
    const requestSpy = sinon.spy(webCrawlerHelper, 'request');
    var cheerioLoadValue = '';
    const cheerio = {
        'load': sinon.fake.returns(cheerioLoadValue)
    };

    describe('crawl', function() {

    })

    describe('visitPage', function() {

    })

    describe('collectInternalLinks', function() {
        
    })

    describe('checkDomain', function() {
        
    })
})

