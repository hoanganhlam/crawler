'use strict';
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
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

NewSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model(collection, NewSchema);
