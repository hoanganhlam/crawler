const {DataModel} = require('core-model');
const {responseJSON, responseError} = require('./response');
const {getBody} = require('./request');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res) => {
    let data = getBody(req, ['task', 'url', 'value']);

    let test = await DataModel.find({url: data.url, task: data.task})
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

exports.list = async (req, res, next) => {
    const pageSize = Number.parseInt(req.query.pageSize) || 9;
    const page = req.query.page || 1;
    let query = {}
    let aggregate = [
        {
            $lookup: {
                from: 'Task',
                localField: 'task',
                foreignField: '_id',
                as: 'task'
            }
        },
        {
            $match: query
        },

    ]
    if (req.query.campaign) {
        query['task.campaign'] = {$all: [ObjectId(req.query.campaign)]}
    }
    try {
        const options = {
            page: page,
            limit: pageSize
        };
        let myAggregate = DataModel.aggregate(aggregate);
        let test = await DataModel.aggregatePaginate(myAggregate, options)
        res.json({
            results: test.docs,
            currentPage: page,
            numPage: test.totalPages,
            total: test.totalDocs
        });
    } catch (err) {
        return next(err)
    }
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
