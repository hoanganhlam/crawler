const amqp = require('amqplib/callback_api');
const RABBIT_HOST = process.env.RABBIT_HOST;
const USERNAME = process.env.RABBIT_USERNAME;
const PASSWORD = process.env.RABBIT_PASSWORD;
const PORT = process.env.RABBIT_PORT;
const URL = `amqp://${USERNAME}:${PASSWORD}@${RABBIT_HOST}:${PORT}`;
const lodash = require('lodash');
const logger = require('../../helpers/logger');

/**
 * Open connection and resolve a channel
 * @returns {Promise<any>}
 */
function openConnection() {
    return new Promise(resolve => {
        amqp.connect(URL, (err, conn) => {
            if (err) {
                // openConnection();
                logger.error('Error when connect rabbitMQ %o', err, 'core-rabbit');
            } else {
                conn.on('close', openConnection);
                conn.on('error', function (err) {
                    logger.error('Error when connect rabbitMQ %o', err, 'core-rabbit');
                    // openConnection();
                });
                conn.createChannel((err, ch) => {
                    ch.on('error', (err) => {
                        logger.error('Error when create channel %o', err, 'core-rabbit');
                    });
                    resolve(ch);
                });
            }
        });
    });
}

/**
 * Add data to store in a queue
 * @param queueName
 * @param data
 * @returns {Promise<void>}
 */
const addDataToQueue = async (queueName, data) => {
    let channel = await openConnection();
    channel.assertQueue(queueName, {durable: true});
    if (lodash.isArray(data)) {
        await data.forEach(item => {
            if (lodash.isObject(item)) {
                channel.sendToQueue(queueName, new Buffer(JSON.stringify(item)), {persistent: true});
            }
        });
        console.log(`Number of items which add to queue "${queueName}": `, data.length);
    } else if (lodash.isObject(data)) {
        await channel.sendToQueue(queueName, new Buffer(JSON.stringify(data)), {persistent: true});
        console.log(`Number of items which add to queue "${queueName}": `, 1);
    } else {
        await channel.sendToQueue(queueName, new Buffer(data), {persistent: true});
        console.log(`Number of items which add to queue "${queueName}": `, 1);
    }
};

module.exports = {
    openConnection,
    addDataToQueue
};