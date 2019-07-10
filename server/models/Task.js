'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'Task';

const TaskSchema = new Schema({
    title: String,
    isLoop: Boolean,
    schedule: String,
    isHeadless: {type: Boolean, default: true},
    tasks: []
}, {
    versionKey: false,
    collection: collection
});

module.exports = mongoose.model(collection, TaskSchema);
