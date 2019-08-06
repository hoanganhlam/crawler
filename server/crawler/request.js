const {DataModel} = require('core-model');
const axios = require('axios');
const {makeNestedObjWithArrayItemsAsKeys, deepFind, sleep, fieldParse, getTarget} = require('./unity');
const cheerio = require('cheerio');

class Request {
    constructor(options, io) {
        this.options = options;
        this.io = io
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
                        let target = getTarget(this.traveler[task.key]['data'], this.options['targetType'], {
                            path: this.options['loopPath'],
                            position: 'href'
                        })
                        if (target) {
                            task['options']['actionTarget'] = target
                        } else {
                            break
                        }
                    }
                    starting = false
                    await this.handleAction(task)
                    page++
                    await sleep(30000)
                }
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
        switch (task.action) {
            case 'GOTO':
                let params = {}
                if (this.options['loopPath']) {

                }
                for (let i = 0; i < task.options.params.length; i++) {
                    params[task.options.params[i].key] = task.options.params[i].value
                }
                this.traveler[task.key] = await axios.get(task['options']['actionTarget'], {
                    params: params
                })
                if (task.children) {
                    await this.start(task.children, this.traveler)
                }
                break
            case 'EXTRACT':
                await this.extract(task, this.traveler[task['options']['extractKey']]['data'])
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
                    let arrTemp = fieldParse(field, $(elms[i]), field.type)
                    traveler[field.key] = arrTemp.length === 1 ? arrTemp[0] : arrTemp;
                    if (!Array.isArray(traveler[field.key]) && field.append) {
                        if (field['isTrim']) {
                            traveler[field.key] = traveler[field.key].trim()
                        }
                        traveler[field.key] = field.append + traveler[field.key]
                    }
                    if (!Array.isArray(traveler[field.key]) && field.key === 'url') {
                        traveler[field.key] = traveler[field.key].split("?")[0]
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
    Request
}
