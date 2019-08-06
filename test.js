const axios = require('axios');
var xpath = require('xpath')
    , dom = require('xmldom').DOMParser
const cheerio = require('cheerio');


async function test() {
    let node
    let data = await axios.get('https://en.wikipedia.org/wiki/October_30')

    let doc = new dom().parseFromString(data['data'])
    let result = xpath.evaluate("//*[@id=\"mw-content-text\"]/div/ul[1]/li", doc, null, xpath.XPathResult.ANY_TYPE, null)

    node = result.iterateNext();
    while (node) {
        const $ = cheerio.load(node.toString());
        console.log($.text());
        node = result.iterateNext();
    }
}

test()
