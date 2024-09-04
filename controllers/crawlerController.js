const cheerio = require("cheerio");
const axios = require("axios");
const url = require("url");

// Helper function to check if a URL is valid
function isValidUrl(link) {
    const parsed = url.parse(link);
    return !!parsed.host && !!parsed.protocol;
}

// Function to get all internal links from a webpage
async function getAllLinks(currentUrl) {
    const urls = new Set();
    const domainName = url.parse(currentUrl).host;
    const response = await axios.get(currentUrl);
    const $ = cheerio.load(response.data);

    $('a[href]').each((index, element) => {
        let href = $(element).attr('href');
        href = url.resolve(currentUrl, href);
        const parsedHref = url.parse(href);
        href = `${parsedHref.protocol}//${parsedHref.host}${parsedHref.pathname}`;
        if (parsedHref.host === domainName && isValidUrl(href)) {
            urls.add(href);
        }
    });
    return urls;
}

// Function to crawl the website and return all page routes
async function crawlUrls(startUrl, maxPages = 1000) {
    const visitedUrls = new Set();
    const urlsToVisit = new Set([startUrl]);
    const urlSet = new Set();
    
    let pagesCrawled = 0;

    try {
        while (urlsToVisit.size > 0 && pagesCrawled < maxPages) {
            const currentUrl = urlsToVisit.values().next().value;
            urlsToVisit.delete(currentUrl);

            if (!visitedUrls.has(currentUrl)) {
                const parsedUrl = url.parse(currentUrl);
                urlSet.add(parsedUrl.href);
                visitedUrls.add(currentUrl);
                pagesCrawled++;
                const newUrls = await getAllLinks(currentUrl);
                newUrls.forEach(link => {
                    if (!visitedUrls.has(link)) {
                        urlsToVisit.add(link);
                    }
                });
            }
        }
    } catch (error) {
        console.log(error.message);
    }

    return Array.from(urlSet);
}

module.exports = { crawlUrls };
