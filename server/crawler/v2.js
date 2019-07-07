const puppeteer = require('puppeteer');
const batchCrawl = Number(process.env.BATCH_CRAWL || 5);
const cheerio = require('cheerio');
// import {
//     isPrimitive
// } from 'util';
const block_ressources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
const skippedResources = ['quantserve', 'adzerk', 'doubleclick', 'adition', 'exelator', 'sharethrough', 'cdn.api.twitter', 'google-analytics', 'googletagmanager', 'google', 'fontawesome', 'facebook', 'analytics', 'optimizely', 'clicktale', 'mixpanel', 'zedo', 'clicksor', 'tiqcdn',];
const invalidUrl = /([a-zA-Z0-9\s_\\.\-\(\):])+(.doc|.docx|.pdf|.png|.jpg|.jpeg|.svg|.gif|.json|.xls|.mp3|.mp4|.wav|.3gp|.aa|.aac|.aax|.m4a|.m4b|.vox|.wabm|.ogg|.webm)$/i

const SAMPLE = [
    {
        key: '1',
        title: "Đến trang chủ",
        action: "GOTO",
        target: "https://vnexpress.net/",
    },
    {
        key: '2',
        title: "Đến danh mục du lịch",
        action: "CLICK",
        target: "#main_menu > a.mnu_dulich",
    },
    {
        key: '3',
        title: "Lấy hết các phân trang",
        target: ".next",
        loop: "PAGING",
        children: [{
            key: '31',
            title: "Bóc tách dữ liệu",
            action: "EXTRACT",
            target: "#col_sticky > article",
            fields: [{
                field: 'title',
                attr: 'innerHTML',
                path: 'a',

            },
                {
                    field: 'url',
                    attr: 'href',
                    path: 'a',

                },
                {
                    field: 'description',
                    attr: 'innerHTML',
                    path: '.description',

                }
            ]
        }]
    }
]

var io = null

/**
 * function crawler
 * @script Kịch bản crawler được lưu vào Database
 * Hàm này sẽ lấy kịch bản và map với lại structure
 */
export function crawler(scripts, ioP) {
    io = ioP
    puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    }).then(async browser => {
        const page = await browser.newPage();
        starting(scripts, page);
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
    return result;
}

async function singleLoop(script, page, browser) {
    var url = page.url();
    var pages = [];
    var promises = [];
    for (let i = 0; i < batchCrawl; i++) {
        const tempPage = await browser.newPage();
        tempPage.on('request', request => {
            const requestUrl = request._url.split('?')[0].split('#')[0];
            if (
                block_ressources.indexOf(request.resourceType) !== -1 ||
                skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
            ) {
                request.abort();
            } else {
                request.continue();
            }
        });
        pages.push(tempPage);
        promises.push(starting(script.children, tempPage));
        await tempPage.goto(url);
    }
    await Promise.all(promises);
}

async function pagingLoop(script, page) {
    await starting(script.children, page);
    await Promise.all([
        page.waitForNavigation(),
        page.click(script.target)
    ]);
    pagingLoop(script, page);
}

async function lazyLoadingLoop(script, page) {
    // Bó cmn tay
}
