'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'Task';

const NewSchema = new Schema({
    title: String,
    crawlType: String,
    tasks: [],
    campaign: {type: mongoose.Schema.Types.ObjectId, ref: 'Campaign'},
    options: Object
}, {
    versionKey: false,
    collection: collection,
    timestamps: true
});

module.exports = mongoose.model(collection, NewSchema);
