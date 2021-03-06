const {DataModel} = require('core-model');
const puppeteer = require('puppeteer');
const batchCrawl = Number(process.env.BATCH_CRAWL || 1);
const cheerio = require('cheerio');
const axios = require('axios');
const block_ressources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
const skippedResources = ['quantserve', 'adzerk', 'doubleclick', 'adition', 'exelator', 'sharethrough', 'cdn.api.twitter', 'google-analytics', 'googletagmanager', 'google', 'fontawesome', 'facebook', 'analytics', 'optimizely', 'clicktale', 'mixpanel', 'zedo', 'clicksor', 'tiqcdn',];
const isOptimized = false;
const {Api} = require('./api')
const {Request} = require('./request')
const {Headless} = require('./headless')
/**
 * function crawler
 * @script Kịch bản crawler được lưu vào Database
 * Hàm này sẽ lấy kịch bản và map với lại structure
 */

let io = null;
let data = {}
let taskId = null
let isTest = false

const makeNestedObjWithArrayItemsAsKeys = (arr, value) => {
    const reducer = (acc, item) => ({
        [item]: acc
    });
    return arr.reduceRight(reducer, value);
};

export function crawler(script, listener, test) {
    isTest = test
    io = listener
    taskId = script._id
    switch (script.crawlType) {
        case 'HEADLESS': {
            let crawler = new Headless({
                isTest: test,
                taskId: taskId
            }, io)
            crawler.start(script.tasks, null, "a", "b")
            break;
        }
        case 'NOHEADLESS': {
            let crawler = new Request({
                isTest: test,
                taskId: taskId
            }, io)
            crawler.start(script.tasks, null, "a", "b")
            break;
        }
        case 'API': {
            let crawler = new Api({
                isTest: test,
                taskId: taskId
            }, io)
            crawler.start(script.tasks, null)
            break;
        }
        default:
            break;
    }
}

//Headless
async function headlessCrawling(scripts, page, browser) {
    for (let i = 0; i < scripts.length; i++) {
        let action = scripts[i];
        await headlessLoopType(action, page, browser);
    }
}

async function headlessLoopType(script, page, browser) {
    var loopType = script.loop;
    switch (loopType) {
        case 'SINGLE':
            await singleLoop(script, page, browser);
            break;
        case 'PAGING':
            await page.waitForSelector(script.target);
            await pagingLoop(script, page, browser);
            break;
        case 'LAZY':
            await lazyLoadingLoop(script, page, browser);
            break;
        case 'ARRAY':
            await headlessArrayLoop(script, browser);
            break;
        default:
            await headlessActionType(script, page);
            break;
    }
}

async function headlessActionType(script, page) {
    var actionType = script.action;
    switch (actionType) {
        case 'GOTO':
            await page.goto(script.target, {
                waitUntil: 'networkidle0',
                timeout: 360000
            });
            break;
        case 'CLICK':
            // await page.waitForSelector(script.target);
            const $ = cheerio.load(await page.content());
            const isRedirectToOtherPage = $('a', script.target).get().length !== 0 || $(script.target).attr('href')
            if (isRedirectToOtherPage) {
                await Promise.all([
                    page.click(script.target),
                    page.waitForNavigation(),
                ]);
            } else {
                await Promise.race([
                    page.click(script.target),
                    page.waitForNavigation(),
                ]);
            }

            break;
        case 'INPUT':
            await page.waitForSelector(script.target);
            await page.type(script.target, script.text);
            break;
        case 'EXTRACT':
            await page.waitForSelector(script.target);
            await headlessExtractData(script, page);
            break;
        case 'BACK':
            await page.back();
            break;
        default:
            break;
    }
}

async function headlessExtractData(script, page) {
    const html = await page.content();
    extractData(script, html);
}

//No headless
async function noHeadlessCrawling(scripts, data) {
    for (let i = 0; i < scripts.length; i++) {
        let action = scripts[i];
        await noHeadlessLoopType(action, data);
    }
}

async function noHeadlessLoopType(script, data) {
    var loopType = script.loop;
    switch (loopType) {
        case 'ARRAY':
            await noHeadlessArrayLoop(script);
            break;
        default:
            await noHeadlessActionType(script, data);
            break;
    }
}

async function noHeadlessActionType(script, data) {
    var actionType = script.action;
    switch (actionType) {
        case 'GOTO':
            data.response = await axios.get(script.target).catch(err => io.emit('error', err));
            break;
        case 'EXTRACT':
            noHeadlessExtractData(script, data);
            break;
        default:
            break;
    }
}

function noHeadlessExtractData(script, data) {
    const html = data.response.data;
    extractData(script, html);
}

//Loop
async function singleLoop(script, page, browser) {
    const $ = cheerio.load(await page.content());
    let urls = [];
    $(script.target).each((index, value) => {
        let url = $('a', value).get()[0];
        if (url) urls.push(data);
    });
    while (urls.length) {
        let chunks = urls.slice(0, batchCrawl);
        let pages = [];
        await Promise.all(chunks.map(async (u) => {
            const tempPage = await browser.newPage();
            pages.push(tempPage);
            if (isOptimized) {
                await page.setRequestInterception(true)
                tempPage.on('request', request => {
                    const requestUrl = request._url.split('?')[0].split('#')[0];
                    if (
                        block_ressources.indexOf(request.resourceType()) !== -1 ||
                        skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
                    ) {
                        request.abort();
                    } else {
                        request.continue();
                    }
                });
            }
            await headlessCrawling(script.children, tempPage, browser);
            for (let p of pages) {
                await p.close();
            }
        }))

    }
}

async function pagingLoop(script, page, browser) {
    let maxPage = script.maxPage;
    let isInfinity = false;
    let loopCondition = true;
    if (!maxPage) {
        const $ = cheerio.load(await page.content());
        loopCondition = $(script.target) && $(script.target).attr('href');
        isInfinity = true;
    }
    while (loopCondition) {
        await headlessCrawling(script.children, page, browser);
        // page.click(script.target)
        // await page.waitForNavigation({
        //     waitUntil: 'networkidle2',
        // });
        const $ = cheerio.load(await page.content());
        let target = $(script.target) && $(script.target).attr('href');
        if (target) {
            page.click(script.target)
            await page.goto(target, {
                waitUntil: 'networkidle2',
                timeout: 360000
            });
        }
        maxPage = isInfinity ? 0 : maxPage - 1;
        loopCondition = isInfinity ? target : maxPage > 1;
    }
}

async function lazyLoadingLoop(script, page, browser) {
    let stopCondition = script.stopCondition;
    while (stopCondition > 1) {
        await autoScroll(page);
        --stopCondition;
    }
    headlessCrawling(script.children, page, browser);
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, scrollHeight);
                clearInterval(timer);
                resolve()
            }, 3000)
        })
    });
}

async function noHeadlessArrayLoop(scripts) {
    let urls = scripts.urls;
    while (urls.length) {
        let chunks = urls.slice(0, batchCrawl);
        urls = urls.slice(chunks.length);
        let responses = await Promise.all(chunks.map(url => axios.get(url).catch(err => io.emit('error', err))));
        // await Promise.all(responses.map(response => noHeadlessStarting(scripts.children, {
        //     response: response
        // })));
        responses.map(response => noHeadlessCrawling(scripts.children, {
            response: response
        }));
    }
}

async function headlessArrayLoop(scripts, browser) {
    let urls = scripts.urls;
    while (urls.length) {
        let chunks = urls.slice(0, batchCrawl);
        urls = urls.slice(chunks.length);
        await Promise.all(chunks.map(async (url) => {
            let pages = [];
            const tempPage = await browser.newPage();
            pages.push(tempPage);
            if (isOptimized) {
                await tempPage.setRequestInterception(true)
                tempPage.on('request', request => {
                    const requestUrl = request._url.split('?')[0].split('#')[0];
                    if (
                        block_ressources.indexOf(request.resourceType()) !== -1 ||
                        skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
                    ) {
                        request.abort();
                    } else {
                        request.continue();
                    }
                });
            }
            console.log(url);
            await tempPage.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 360000
            });
            await headlessCrawling(scripts.children, tempPage, browser);
            for (let p of pages) {
                await p.close();
            }
        }))
    }
}

//Extract
function extractData(script, html) {
    const $ = cheerio.load(html);
    $(script.target).each((index, value) => {
        let saveFields = script.field ? script.field.split('.') : []
        let traveler = {}
        for (let field of script.fields) {
            if (field.path === '') {
                traveler[field.key] = $(value).text();
            } else {
                let arrTemp = []
                if (field.attr === null || field.attr === '') {
                    $(field.path, value).each(function (i, elem) {
                        arrTemp.push($(this).html())
                    })
                } else if (field.attr === 'innerHTML') {
                    $(field.path, value).each(function (i, elem) {
                        arrTemp.push($(this).text())
                    })
                } else {
                    $(field.path, value).each(function (i, elem) {
                        arrTemp.push($(this).attr(field.attr));
                    })
                }
                traveler[field.key] = arrTemp.length === 1 ? arrTemp[0] : arrTemp;
            }
        }
        data = {
            ...data,
            ...makeNestedObjWithArrayItemsAsKeys(saveFields, traveler)
        }
        if (script.stop) {
            if (!isTest) {
                let instance = new DataModel({
                    url: data['url'],
                    value: data,
                    task: taskId
                })
                instance.save()
            } else {
                if (io) {
                    io.emit('data', data)
                }
            }

            data = {}
        }
    });
}
