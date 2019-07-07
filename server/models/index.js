'use strict';
require('../helpers/load-env');
const helper = require('../helpers/index');
const path = require('path');
const mongoose = require('mongoose');

let db = {};
let dbURI = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

mongoose.connect(dbURI, {useNewUrlParser: true});

mongoose.connection.on('error', (error) => {
    console.log(error);
});

mongoose.connection.on('connected', () => {
    console.log(`Connected to ${dbURI}`);
});

helper.readDirRecursive({
    path: path.join(process.cwd(), '/server/models'),
    excludes: ['.', '..', path.basename(module.filename)]
})
    .forEach(file => {
        let model = (require(file).default)
            ? require(file).default : require(file);
        if (typeof model.modelName !== 'undefined') {
            db[model.modelName] = model;
            db[model.modelName + 'Model'] = model;
        }
    });

module.exports = db;

