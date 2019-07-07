const getResponseStructure = (message) => {
	return {
		messageCode: 'success',
		message: message,
		body: [{}]
	};
};

/**
 *
 * @param res
 * @param message: message to response for user
 * @param body: data to response for user
 * @param extendData: statusCode, messageCode if error has been occurred
 * @returns {*}
 */
const responseJSON = (res, message, body = {}, extendData = {}) => {
	res.status(200);
	return res.json(Object.assign({}, getResponseStructure(message), {body}, extendData));
};

const responseError = (res, message, extendData = {}, statusCode = 500) => {
	res.status(statusCode);
	return res.json(Object.assign({}, getResponseStructure(message), {}, extendData));
};


module.exports = {
	responseJSON,
	responseError
};