'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'User';

const UserSchema = new Schema({
	username: String,
	password: String,
	name: String
}, {
	versionKey: false,
	collection: collection
});

module.exports = mongoose.model(collection, UserSchema);
