const puppeteer = require('puppeteer');
const batchCrawl = Number(process.env.BATCH_CRAWL || 5);
const cheerio = require('cheerio');
const block_ressources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
const skippedResources = ['quantserve', 'adzerk', 'doubleclick', 'adition', 'exelator', 'sharethrough', 'cdn.api.twitter', 'google-analytics', 'googletagmanager', 'google', 'fontawesome', 'facebook', 'analytics', 'optimizely', 'clicktale', 'mixpanel', 'zedo', 'clicksor', 'tiqcdn', ];
let isOptimized = false;

const SAMPLE = [{
    key: '1',
    title: "Đến trang chủ",
    action: "GOTO",
    target: "https://www.sitepoint.com/vuex-beginner-guide/",
},
    {
        key: '3',
        title: "Lấy hết các phân trang",
        loop: "LAZY"
    }
]

var io = null;

/**
 * function crawler
 * @script Kịch bản crawler được lưu vào Database
 * Hàm này sẽ lấy kịch bản và map với lại structure
 */
export function crawler(scripts, ioP) {
    io = ioP
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
        await starting(scripts, page);
        await browser.close();
    });
}

async function starting(scripts, page) {
    for (let i = 0; i < scripts.length; i++) {
        let action = scripts[i];
        await loopType(action, page);
    }
}

async function loopType(script, page) {
    var loopType = script.loop;
    switch (loopType) {
        case 'SINGLE':
            await singleLoop(script, page);
            break;
        case 'PAGING':
            await pagingLoop(script, page);
            break;
        case 'LAZY':
            await lazyLoadingLoop(script, page);
            break;
        default:
            await actionType(script, page);
            break;
    }
}

async function actionType(script, page) {
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
            await page.click(script.target);
            break;
        case 'INPUT':
            await page.waitForSelector(script.target);
            await page.type(script.target, script.text);
            break;
        case 'EXTRACT':
            await extractData(script.target, script.fields, page);
            break;
        case 'BACK':
            await page.back();
            break;
        default:
            break;
    }
}

async function extractData(target, fields, page) {
    await page.waitForSelector(target);
    let result = [];
    const $ = cheerio.load(await page.content());
    $(target).each((index, value) => {
        let data = {};
        for (let field of fields) {
            if (!field) {
                data[field.field] = $(field.path, value).html();
                continue;
            }
            if (field.attr === 'innerHTML') {
                data[field.field] = $(field.path, value).text();
                continue;
            }
            data[field.field] = $(field.path, value).attr(field.attr);
        }
        if (io) {
            io.emit('data', data)
        }
        result.push(data);
    });
    //Save to Database here
    return result;
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
            return starting(script.children, tempPage);
        }))
        for (let p of pages) {
            await p.close();
        }
    }
}

async function pagingLoop(script, page) {
    let stopCondition = script.maxPage;
    const $ = cheerio.load(await page.content());
    let target = $(script.target).get();
    while (stopCondition > 1 || target) {
        await starting(script.children, page);
        const $ = cheerio.load(await page.content());
        target = $(script.target).get();
        if (target) {
            await Promise.all([
                page.waitForNavigation(),
                page.click(script.target)
            ]);
        }
        --stopCondition;
    }
}

async function lazyLoadingLoop(script, page) {
    let stopCondition = script.stopCondition;
    while (stopCondition > 1) {
        await autoScroll(page);
        --stopCondition;
    }
    starting(script.children, page);
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
