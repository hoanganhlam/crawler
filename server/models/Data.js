'use strict';
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'Data';

const NewSchema = new Schema({
    task: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
    url: String,
    value: Object,
}, {
    versionKey: false,
    collection: collection,
    timestamps: true
});

NewSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(collection, NewSchema);
