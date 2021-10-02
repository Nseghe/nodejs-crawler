class webCrawlerHelper{
    constructor({
        urlString,
        URL,
        request,
        cheerio,
    }) {
        this.request = request;
        this.cheerio = cheerio;
        this.startUrl =  new URL(urlString);
        this.pagesVisited = {};
        this.pagesToVisit = [];
        this.baseUrl = this.startUrl.protocol + "//" + this.startUrl.hostname;
        this.crawl = this.crawl.bind(this);

        this.pagesToVisit.push(urlString);
    }

    crawl() {
        var self = this;
        var nextPageToVisit = self.pagesToVisit.pop();
        if (nextPageToVisit == null) {
            return;
        } else if (self.pagesVisited[nextPageToVisit]) {
            self.crawl();
        } else {
            self.visitPage(self, nextPageToVisit);
        }
    }

    visitPage(self, urlString) {
        self.pagesVisited[urlString] = true;
        console.log(urlString);
        self.request({
            url: urlString,
            followAllRedirects: true,
        }, function(error, response, body) {
            if (error || response.statusCode != 200) {
                self.crawl();
                return;
            }
            var $ = self.cheerio.load(body);
            self.collectInternalLinks(self, $);
            self.crawl();
        })
    }

    collectInternalLinks(self, $) {
        var relativeLinks = $("a[href^='/']");
        var absoluteLinks = $("a[href^='http']");
        relativeLinks.each(function() {
            var urlString = self.baseUrl + $(this).attr('href');
            if (!(urlString in self.pagesVisited)) {
                self.pagesToVisit.push(urlString);
                self.pagesVisited[urlString] = false;
            }
        })
        absoluteLinks.each(function() {
            var urlString = $(this).attr('href');
            if (!(urlString in self.pagesVisited) &&
                self.checkDomain(self, urlString)
            ) {
                self.pagesToVisit.push(urlString);
                self.pagesVisited[urlString] = false;
            }
        })
    }
    
    checkDomain(self, urlString) {
        var url = new URL(urlString);
        if (url.hostname == self.startUrl.hostname) {
            return true;
        }
        return false;
    }
}

module.exports = webCrawlerHelper;
