const {TaskModel} = require('core-model');
const {responseJSON, responseError} = require('./response');
const {getBody} = require('./request');
const {crawler} = require('../crawler')

exports.create = (req, res) => {
    let data = getBody(req, ['title', 'tasks', 'options', 'campaign', 'crawlType']);
    let task = new TaskModel(data)
    task.save().then(function () {
        return responseJSON(res, 'Create user successfully', task);
    }).catch(error => {
        let message = error && error.message ? error.message : 'Error when get users';
        return responseError(res, message, {messageCode: 'error_get_user'});
    });
};

exports.list = (req, res) => {
    return TaskModel.find({})
        .populate('campaign')
        .then(tasks => {
            return responseJSON(res, 'Get all user successfully', tasks);
        })
        .catch(error => {
            let message = error && error.message ? error.message : 'Error when get all users';
            return responseError(res, message, {messageCode: 'error_get_all_user'});
        });
};

exports.retrieve = (req, res) => {
    return responseJSON(res, 'Get all user successfully', req.instance);
};

exports.update = (req, res) => {
    let data = getBody(req, ['title', 'tasks', 'options', 'campaign', 'crawlType']);
    for (let field in data) {
        if (typeof data[field] !== 'undefined') {
            req.instance[field] = data[field];
        }
    }
    req.instance.save().then(function (instance) {
        return res.json(instance);
    }).catch(error => {
        let message = error && error.message ? error.message : 'Error when get all users';
        return responseError(res, message, {messageCode: 'error_get_all_user'});
    });
};

exports.delete = (req, res) => {
    return req.instance.remove().then(function () {
        return res.sendStatus(204);
    });
};
