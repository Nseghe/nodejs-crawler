const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const URL = require('url-parse');
const WebCrawlerHelper = require('../../src/web.crawler.helper.js');

describe('webCrawler', function() {

    const urlString = 'https://www.testwebsite.com/';
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

    describe('addNewWorker', function() {
        it(
            '',
            function() {

        })
        it(
            '',
            function() {

        })
        
    })

    describe('crawl', function() {
        it(
            '',
            function() {
            
        })
        it(
            '',
            function() {
            
        })
        it(
            '',
            function() {
            
        })
    })

    describe('runTask', function() {
        it(
            '',
            function() {
            
        })
        it(
            '',
            function() {
            
        })
    })

    describe('TerminateWorkersIfCrawlComplete', function() {
        it(
            '',
            function() {
            
        })
        it(
            '',
            function() {
            
        })
    })

    describe('processWorkerResult', function() {
        it(
            '',
            function() {
            
        })
        it(
            '',
            function() {
            
        })
    })

    describe('close', function() {
        it(
            '',
            function() {
            
        })
        it(
            '',
            function() {
            
        })
    })
})

