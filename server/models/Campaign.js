'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'Campaign';

const NewSchema = new Schema({
    title: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    fields: [{title: String, key: String}]
}, {
    versionKey: false,
    collection: collection,
    timestamps: true
});

module.exports = mongoose.model(collection, NewSchema);
