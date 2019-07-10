// import {
//     async
// } from 'q';

const puppeteer = require('puppeteer');
const batchCrawl = Number(process.env.BATCH_CRAWL || 5);
const cheerio = require('cheerio');
const axios = require('axios');
const block_ressources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
const skippedResources = ['quantserve', 'adzerk', 'doubleclick', 'adition', 'exelator', 'sharethrough', 'cdn.api.twitter', 'google-analytics', 'googletagmanager', 'google', 'fontawesome', 'facebook', 'analytics', 'optimizely', 'clicktale', 'mixpanel', 'zedo', 'clicksor', 'tiqcdn', ];
let isOptimized = true;
var io = null;

/**
 * function crawler
 * @script Kịch bản crawler được lưu vào Database
 * Hàm này sẽ lấy kịch bản và map với lại structure
 */

export function crawler(scripts, ioP) {
    io = ioP
    if (scripts.isHeadless) {
        puppeteer.launch({
            headless: isOptimized,
            defaultViewport: null,
            args: ['--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920,1080'
            ]
        }).then(async browser => {
            const page = await browser.newPage();
            if (isOptimized) {
                await page.setRequestInterception(true);
                page.on('request', request => {
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
            await headlessStarting(scripts.tasks, page, browser);
            await browser.close();
        });
    } else {
        noHeadlessStarting(scripts.tasks, {
            response: {}
        });
    }
}

async function headlessStarting(scripts, page, browser) {
    for (let i = 0; i < scripts.length; i++) {
        let action = scripts[i];
        await headlessLoopType(action, page, browser);
    }
}

async function noHeadlessStarting(scripts, data) {
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

async function headlessLoopType(script, page, browser) {
    var loopType = script.loop;
    switch (loopType) {
        case 'SINGLE':
            await singleLoop(script, page, browser);
            break;
        case 'PAGING':
            await pagingLoop(script, page);
            break;
        case 'LAZY':
            await lazyLoadingLoop(script, page);
            break;
        case 'ARRAY':
            await headlessArrayLoop(script, browser);
            break;
        default:
            await headlessActionType(script, page);
            break;
    }
}

async function noHeadlessActionType(script, data) {
    var actionType = script.action;
    switch (actionType) {
        case 'GOTO':
            data.response = await axios.get(script.target).catch(err => console.log(err));;
            break;
        case 'EXTRACT':
            noHeadlessExtractData(script.target, script.fields, data);
            break;
        default:
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
            await page.waitForSelector(script.target);
            await Promise.all([
                page.click(script.target),
                page.waitForNavigation(),
            ]);
            break;
        case 'INPUT':
            await page.waitForSelector(script.target);
            await page.type(script.target, script.text);
            break;
        case 'EXTRACT':
            await headlessExtractData(script.target, script.fields, page);
            break;
        case 'BACK':
            await page.back();
            break;
        default:
            break;
    }
}

function noHeadlessExtractData(target, fields, data) {
    const html = data.response.data;
    extractData(target, fields, html);
}

async function headlessExtractData(target, fields, page) {
    await page.waitForSelector(target);
    const html = await page.content();
    extractData(target, fields, html);
}

function extractData(target, fields, html) {
    let result = [];
    const $ = cheerio.load(html);
    $(target).each((index, value) => {
        let data = {};
        for (let field of fields) {
            if (field.path === '') {
                data[field.field] = $(value).text();
            } else {
                if (!field.attr) {
                    data[field.field] = $(field.path, value).html();
                    continue;
                }
                if (field.attr === 'innerHTML') {
                    data[field.field] = $(field.path, value).text();
                    continue;
                }
                data[field.field] = $(field.path, value).attr(field.attr);
            }
        }
        console.log('wtf');
        if (io) {
            io.emit('data', data)
        }
        result.push(data);
    });
}

async function singleLoop(script, page, browser) {
    const $ = cheerio.load(await page.content());
    let urls = [];
    $(target).each((index, value) => {
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
            return headlessStarting(script.children, tempPage);
        }))
        for (let p of pages) {
            await p.close();
        }
    }
}

async function pagingLoop(script, page) {

    let maxPage = script.maxPage;
    let isInfinity = false;
    let loopCondition = true;
    if (!maxPage) {
        const $ = cheerio.load(await page.content());
        loopCondition = $(script.target) && $(script.target).attr('href');
        isInfinity = true;
    }
    while (loopCondition) {
        await headlessStarting(script.children, page);
        const $ = cheerio.load(await page.content());
        let target = $(script.target) && $(script.target).attr('href');
        if (target) {
            await page.goto(target, {
                waitUntil: 'networkidle0',
                timeout: 360000
            });
        }
        maxPage = isInfinity ? 0 : maxPage - 1;
        loopCondition = isInfinity ? target : maxPage > 1;
    }
}

async function noHeadlessArrayLoop(scripts) {
    let urls = scripts.urls;
    while (urls.length) {
        let chunks = urls.slice(0, batchCrawl);
        let responses = await Promise.all(chunks.map(url => axios.get(url).catch(err => console.log(err))));
        // await Promise.all(responses.map(response => noHeadlessStarting(scripts.children, {
        //     response: response
        // })));
        responses.map(response => noHeadlessStarting(scripts.children, {
            response: response
        }));
    }
}

async function headlessArrayLoop(scripts, browser) {
    let urls = scripts.urls;
    while (urls.length) {
        let chunks = urls.slice(0, batchCrawl);
        let pages = [];
        await Promise.all(chunks.map(async (url) => {
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
            await tempPage.goto(url);
            return headlessStarting(script.children, tempPage);
        }))
    }
}

async function lazyLoadingLoop(script, page) {
    let stopCondition = script.stopCondition;
    while (stopCondition > 1) {
        await autoScroll(page);
        --stopCondition;
    }
    headlessStarting(script.children, page);
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