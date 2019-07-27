const {Api} = require('./api')
const {Request} = require('./request')
const {Headless} = require('./headless')
/**
 * function crawler
 * @script Kịch bản crawler được lưu vào Database
 * Hàm này sẽ lấy kịch bản và map với lại structure
 */

let io = null;
let taskId = null
let isTest = false

export async function crawler(script, listener, test) {
    isTest = test
    io = listener
    taskId = script._id
    switch (script.crawlType) {
        case 'HEADLESS': {
            let crawler = new Headless({
                isTest: test,
                taskId: taskId
            }, io)
            await crawler.init()
            crawler.start(script.tasks, null).then(() =>{
                crawler.end()
            })
            break;
        }
        case 'NOHEADLESS': {
            let crawler = new Request({
                isTest: test,
                taskId: taskId
            }, io)
            crawler.start(script.tasks, null)
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
