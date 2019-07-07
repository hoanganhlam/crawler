const lodash = require('lodash');
const helpers = require('../helpers/index');

function getData(type, req, fields, defaultValue, extData) {
	if (!fields) return req[type];
	if (!lodash.isArray(fields)) return lodash.get(req[type], fields, defaultValue);
	return Object.assign({}, helpers.getAttributes(req[type], fields), extData);
}

const getBody = (req, fields, defaultValue, extData) => {
	return getData('body', req, fields, defaultValue, extData);
};

const getQuery = (req, fields, defaultValue, extData) => {
	return getData('query', req, fields, defaultValue, extData);
};

const getHeader = (req, fields, defaultValue, extData) => {
	return getData('headers', req, fields, defaultValue, extData);
};

const getParam = (req, fields, defaultValue, extData) => {
	return getData('params', req, fields, defaultValue, extData);
};

module.exports = {
	getBody,
	getQuery,
	getHeader,
	getParam
};
