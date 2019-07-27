const {DataModel} = require('core-model');
const axios = require('axios');
const {makeNestedObjWithArrayItemsAsKeys, deepFind} = require('./unity');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep() {
    await timeout(3000);
}

class Api {
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
                let page = 0
                let starting = true
                this.options['loopPath'] = task['options']['loopTarget']
                this.options['loopKey'] = task['options']['loopKey']
                while (starting || (deepFind(this.traveler, this.options['loopPath']) && page < 5)) {
                    starting = false
                    await this.handleAction(task)
                    page++
                    await sleep(30000)
                }
                break
        }
    }

    async handleAction(task) {
        switch (task.action) {
            case 'GOTO':
                let params = {}
                if (this.options['loopPath']) {
                    params[this.options['loopKey']] = deepFind(this.traveler, this.options['loopPath'])
                }
                for (let i = 0; i < task.options.params.length; i++) {
                    params[task.options.params[i].key] = task.options.params[i].value
                }
                this.traveler.res = await axios.get(task['options']['actionTarget'], {
                    params: params
                })
                break
            case 'EXTRACT':
                let results = deepFind(this.traveler.res, task['options']['actionTarget'])
                let loopPathValue = deepFind(this.traveler.res, this.options['loopPath']) || null
                if (Array.isArray(results)) {
                    for (let i = 0; i < results.length; i++) {
                        await this.extract(task, results[i])
                    }
                } else {
                    await this.extract(task, results)
                }

                if (this.options['loopPath']) {
                    this.traveler = {
                        ...this.traveler,
                        ...makeNestedObjWithArrayItemsAsKeys(this.options['loopPath'].split('.'), loopPathValue)
                    }
                }
                break
            default:
                break
        }
        if (task.children) {
            await this.start(task.children, this.traveler)
        }
    }

    async extract(script, instance) {
        let saveFields = script.options.field ? script.options.field.split('.') : []
        let traveler = {}
        for (let field of script.fields) {
            traveler[field.key] = deepFind(instance, field.path)
        }
        this.data = {
            ...this.data,
            ...makeNestedObjWithArrayItemsAsKeys(saveFields, traveler)
        }
        if (script.stop) {
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
    }

}

module.exports = {
    Api
}
