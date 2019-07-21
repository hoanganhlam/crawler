const {DataModel} = require('core-model');
const {responseJSON, responseError} = require('./response');
const {getBody} = require('./request');


exports.create = async (req, res) => {
    let data = getBody(req, ['task', 'url', 'value']);

    let test = await DataModel.find({url: data.url})
    if (test.length) {
        let instance = test[0]
        instance.data = data.value
        instance = await instance.save()
        return res.json(instance)
    }
    let task = new DataModel(data)
    task.save().then(function (instance) {
        return res.json(instance)
    }).catch(error => {
        let message = error && error.message ? error.message : 'ERROR';
        return responseError(res, message, {messageCode: 'ERROR'});
    });
};

exports.list = (req, res) => {
    return DataModel.find({})
        .then(tasks => {
            return responseJSON(res, 'SUCCESSFULLY', tasks);
        })
        .catch(error => {
            let message = error && error.message ? error.message : 'ERROR';
            return responseError(res, message, {messageCode: 'ERROR'});
        });
};

exports.retrieve = (req, res) => {
    return responseJSON(res, 'SUCCESSFULLY', req.instance);
};

exports.update = (req, res) => {
    let data = getBody(req, ['task', 'url', 'value']);
    for (let field in data) {
        if (typeof data[field] !== 'undefined') {
            req.instance[field] = data[field];
        }
    }
    req.instance.save().then(function (instance) {
        return res.json(instance);
    }).catch(error => {
        let message = error && error.message ? error.message : 'ERROR';
        return responseError(res, message, {messageCode: 'ERROR'});
    });
};

exports.delete = (req, res) => {
    return req.instance.remove().then(function () {
        return res.sendStatus(204);
    });
};
