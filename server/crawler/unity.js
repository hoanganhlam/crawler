const xpath = require('xpath'), DOMParser = require('xmldom').DOMParser
const cheerio = require('cheerio');


const makeNestedObjWithArrayItemsAsKeys = (arr, value) => {
    const reducer = (acc, item) => ({
        [item]: acc
    });
    return arr.reduceRight(reducer, value);
};

function deepFind(obj, path) {
    let paths = path.split('.')
        , current = obj
        , i;

    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] === undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep() {
    await timeout(3000);
}

function fieldParse(field, elm, type) {
    let arrTemp = []
    if (type === 'xpath') {
        let options = {
            warning: function (w) {}
        }
        let doc = new DOMParser({errorHandler: options}).parseFromString(elm.html())
        if (field.path === '') {
            let result = xpath.evaluate(field.path + '.text()', doc, null, xpath.XPathResult.ANY_TYPE, null)
            arrTemp.push(result)
        } else {
            let node, result = xpath.evaluate(field.path, doc, null, xpath.XPathResult.ANY_TYPE, null)
            node = result.iterateNext();
            while (node) {
                const $ = cheerio.load(node.toString());
                console.log($.text());
                if (field.attr === null || field.attr === '') {
                    arrTemp.push($.html())
                } else if (field.attr === 'innerHTML') {
                    arrTemp.push($.text())
                } else {
                    arrTemp.push($.attr(field.attr));
                }
                node = result.iterateNext();
            }
        }
    } else {
        if (field.path === '') {
            arrTemp.push(elm.text())
        } else {
            const $ = cheerio.load(elm.html());
            if (field.attr === null || field.attr === '') {
                $(field.path).each(function (i, elem) {
                    arrTemp.push($(this).html())
                })
            } else if (field.attr === 'innerHTML') {
                $(field.path).each(function (i, elem) {
                    arrTemp.push($(this).text())
                })
            } else {
                $(field.path).each(function (i, elem) {
                    arrTemp.push($(this).attr(field.attr));
                })
            }
        }
    }
    return arrTemp
}

function getTarget(html, type, {path, position}) {
    let out = null
    if (type === 'xpath') {

    } else {
        let $ = cheerio.load(html);
        switch (position) {
            case '':
                out = $(path).html()
                break
            case null:
                out = $(path).html()
                break
            case 'innerHTML':
                out = $(path).text()
                break
            default:
                out = $(path).attr(position)
                break
        }
    }
    return out
}

module.exports = {
    makeNestedObjWithArrayItemsAsKeys,
    deepFind,
    sleep,
    fieldParse,
    getTarget
}
