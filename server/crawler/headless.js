const puppeteer = require('puppeteer');
const {DataModel} = require('core-model');
const {makeNestedObjWithArrayItemsAsKeys, deepFind, sleep} = require('./unity');
const cheerio = require('cheerio');
const blockResources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
const skippedResources = ['quantserve', 'adzerk', 'doubleclick', 'adition', 'exelator', 'sharethrough', 'cdn.api.twitter', 'google-analytics', 'googletagmanager', 'google', 'fontawesome', 'facebook', 'analytics', 'optimizely', 'clicktale', 'mixpanel', 'zedo', 'clicksor', 'tiqcdn',];
const isOptimized = false;

async function optimized(browser, check) {
    let page = await browser.newPage()
    if (check) {
        await page.setRequestInterception(true);
        page.on('request', request => {
            const requestUrl = request._url.split('?')[0].split('#')[0];
            if (
                blockResources.indexOf(request.resourceType()) !== -1 ||
                skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
            ) {
                request.abort();
            } else {
                request.continue();
            }
        });
    }
    return page
}

class Headless {
    constructor(options, io) {
        this.options = options
        this.io = io
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: isOptimized,
            defaultViewport: null,
            args: ['--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920,1080'
            ]
        })
    }

    end() {
        this.browser.close()
    }

    async start(tasks, traveler) {
        if (typeof traveler === 'undefined' || traveler === null) {
            this.traveler = {}
        }
        for (let i = 0; i < tasks.length; i++) {
            await this.starting(tasks[i])
        }
    }

    async starting(task) {
        if (task.loop) {
            await this.handleLoop(task)
        } else if (task.action) {
            await this.handleAction(task)
        }
    }

    async handleLoop(task) {
        switch (task.loop) {
            case 'ARRAY':
                let urls = task.urls;
                for (let i = 0; i < urls.length; i++) {
                    task['options']['actionTarget'] = urls[i]
                    await this.handleAction(task)
                }
                break
            case 'PAGING':
                let maxPage = task['options']['maxPage'] || 0
                let page = 0
                let starting = true
                this.options['loopPath'] = task['options']['loopTarget']
                while (starting || page < maxPage) {
                    if (!starting) {
                        let page = this.traveler[task.key]
                        await page.waitForSelector(this.options['loopPath']);
                        task['options']['actionTarget'] = this.options['loopPath']
                        // let html = await page.content();
                        // let $ = cheerio.load(html);
                        // let target = $(this.options['loopPath']).attr('href');

                        // if (target) {
                        //     task['options']['actionTarget'] = target
                        // } else {
                        //     break
                        // }
                    }
                    starting = false
                    await this.handleAction(task)
                    page++
                    // await sleep(30000)
                }
                break
            case 'LAZY':
                break
            case 'SINGLE':
                break
        }
    }

    async handleAction(task) {
        if (task['options']['actionSource'] === 'parent') {
            if (typeof task['options']['absTarget'] === 'undefined') {
                task['options']['absTarget'] = task['options']['actionTarget']
            }
            task['options']['actionTarget'] = deepFind(this.data, task['options']['absTarget'])
        }
        let page = this.traveler[task['options']['extractKey']]
        switch (task.action) {
            case 'GOTO':
                console.log('GOTO');
                let params = {}
                if (this.options['loopPath']) {
                }
                for (let i = 0; i < task.options.params.length; i++) {
                    params[task.options.params[i].key] = task.options.params[i].value
                }
                if (typeof this.traveler[task.key] === 'undefined') {
                    this.traveler[task.key] = await optimized(this.browser, isOptimized);
                }
                await this.traveler[task.key].goto(task['options']['actionTarget'], {
                    waitUntil: 'networkidle2',
                    timeout: 300000
                });
                if (task.children) {
                    await this.start(task.children, this.traveler)
                }
                break
            case 'CLICK':
                console.log('CLICK');
                if (page) {
                    await page.waitForSelector(task['options']['actionTarget']);
                    const $ = cheerio.load(await page.content());
                    let url = $(task['options']['actionTarget']).attr('href')
                    console.log(url);
                    if (url) {
                        await page.goto(url, {
                            waitUntil: 'networkidle2'
                        });
                    } else {
                        await page.click(task['options']['actionTarget']);
                    }
                }
                break
            case 'BACK':
                console.log('BACK');
                if (page) {
                    await page.back()
                }
                break
            case 'INPUT':
                console.log('INPUT');
                if (page) {
                    await page.waitForSelector(task['options']['actionTarget']);
                    await page.type(task['options']['actionTarget'], task.text);
                    console.log('INPUTED');
                }
                break
            case 'EXTRACT':
                if (page) {
                    await page.waitForSelector(task['options']['actionTarget'], {
                        timeout: 30000
                    });
                    const html = await page.content();
                    await this.extract(task, html)
                    if (task.stop) {

                    }
                }
                break
            default:
                break
        }
    }

    async extract(task, instance) {
        const $ = cheerio.load(instance);
        let elms = $(task['options']['actionTarget'])
        for (let i = 0; i < elms.length; i++) {
            let saveFields = task.options.field ? task.options.field.split('.') : []
            let traveler = {}
            for (let field of task.fields) {
                if (field.path === '') {
                    traveler[field.key] = $(elms[i]).text();
                } else {
                    let arrTemp = []
                    if (field.attr === null || field.attr === '') {
                        $(field.path, elms[i]).each(function (i, elem) {
                            arrTemp.push($(this).html())
                        })
                    } else if (field.attr === 'innerHTML') {
                        $(field.path, elms[i]).each(function (i, elem) {
                            arrTemp.push($(this).text())
                        })
                    } else {
                        $(field.path, elms[i]).each(function (i, elem) {
                            arrTemp.push($(this).attr(field.attr));
                        })
                    }
                    traveler[field.key] = arrTemp.length === 1 ? arrTemp[0] : arrTemp;
                    if (!Array.isArray(traveler[field.key]) && field.append) {
                        traveler[field.key] = field.append + traveler[field.key]
                    }
                }
            }
            this.data = {
                ...this.data,
                ...makeNestedObjWithArrayItemsAsKeys(saveFields, traveler)
            }
            if (task.stop) {
                if (!this.options['isTest']) {
                    let instance = new DataModel({
                        url: this.data['url'],
                        value: this.data,
                        task: this.options['taskId']
                    })
                    instance.save()
                } else {
                    if (this.io) {
                        this.io.emit('data', this.data)
                    }
                }
                this.data = {}
            }

            if (task.children) {
                await this.start(task.children, this.traveler)
            }
        }
    }
}

module.exports = {
    Headless
}
