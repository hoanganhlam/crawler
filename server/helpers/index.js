require('./load-env');
const fs = require('fs');
const path = require('path');
const lodash = require('lodash');

Array.prototype.inArray = function (callback) {
	if (typeof callback === 'function') {
		return this.findIndex(callback) !== -1;
	}
	return this.indexOf(callback) !== -1;
};
/**
 * @param options Object|String
 * @param options.path String
 * @param options.extensions Array
 * @param options.excludes Array
 *
 * @return Array
 */
exports.readDirRecursive = (options) => {
	if (typeof options === 'string') {
		options = {path: options};
	}
	if (!options.path) {
		throw new Error('Path option is required.');
	}
	options = Object.assign({}, {
		extensions: ['.js'],
		excludes: ['.', '..']
	}, options);
	let results = [];
	fs.readdirSync(options.path)
		.forEach(file => {
			const fullFilePath = path.join(options.path, file);
			if (fs.statSync(fullFilePath).isDirectory()) {
				results = results.concat(this.readDirRecursive(Object.assign({}, options, {path: fullFilePath})));
				return;
			}
			if ((!options.extensions.length || options.extensions.inArray(path.extname(file))) && (!options.excludes.length || !options.excludes.inArray(file))) {
				results.push(fullFilePath);
			}
		});
	return results;
};

exports.removeExt = (fileName) => {
	return (fileName + '').replace(path.extname(fileName), '');
};

exports.pregQuote = (str, delimiter) => {
	//   example 1: preg_quote("$40")
	//   returns 1: '\\$40'
	//   example 2: preg_quote("*RRRING* Hello?")
	//   returns 2: '\\*RRRING\\* Hello\\?'
	//   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:")
	//   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'
	return (str + '')
		.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
};

/**
 * @example
 * let data = {key: 'value1', key2: 2, key3: {subKey: 'subValue'}, key5: 'value_key_5'};
 *
 * getAttributes(data, ['key', 'key3']);
 * @return  result {key: 'value1', key3: {subKey: 'subValue'}};
 *
 * getAttributes(data, ['key', {key3: {key9: ''}}]);
 * @return  result {key: 'value1', key9: {subKey: 'subValue'}};
 *
 * getAttributes(data, ['key', {key4: {defaultKey: 'defaultValue'}}]);
 * @return  result {key: 'value1', key4: {defaultKey: 'defaultValue'}};
 *
 * getAttributes(data, ['key', {key4: {defaultKey: 'defaultValue'}}]);
 * @return  result {key: 'value1', key4: {defaultKey: 'defaultValue'}};
 *
 * getAttributes(data, ['key', {key5: lodash.camelCase}]);
 * @return  result {key: 'value1', key5: 'valueKey5'};
 *
 */
exports.getAttributes = (data, keys) => {
	let res = {};
	keys.forEach(key => {
		if (typeof key === 'string' && typeof data[key] !== 'undefined'
		) {
			if (typeof data[key] === 'string') {
				return res[key] = data[key].trim();
			}
			return res[key] = data[key];
		}
		if (lodash.isObject(key)) {
			let objKey = Object.keys(key)[0];
			if (lodash.isFunction(key[objKey])) {
				return res[key[objKey](objKey)] = lodash.get(data, objKey);
			}
			if (lodash.isObject(key[objKey])) {
				let keys = Object.keys(key[objKey]);
				if (keys.length) {
					return res[keys[0]] = lodash.get(data, objKey, key[objKey][keys[0]]);
				}
			}
			return res[objKey] = lodash.get(data, objKey, key[objKey]);
		}
	});

	return res;
};