const {CampaignModel, UserModel, DataModel, TaskModel} = require('core-model');
const {responseError} = require('./response');
const {getBody} = require('./request');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res, next) => {
    let user = await UserModel.findById(req.payload.id).catch(next);
    if (!user) {
        return res.sendStatus(401);
    }
    let data = getBody(req, ['title']);
    let instance = new CampaignModel(data)
    instance.user = user
    instance.save().then(function (instance) {
        return res.json(instance);
    }).catch(error => {
        let message = error && error.message ? error.message : 'ERROR';
        return responseError(res, message, {messageCode: 'ERROR'});
    });
};

exports.list = async (req, res, next) => {
    const pageSize = Number.parseInt(req.query.pageSize) || 9;
    const page = req.query.page || 1;
    let aggregate = [
        {
            $lookup: {
                from: 'User',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
    ]
    try {
        const results = await CampaignModel.aggregate(aggregate)
        const display = await CampaignModel.aggregate(aggregate)
            .skip((pageSize * page) - pageSize)
            .limit(pageSize)
        res.json({
            results: display,
            currentPage: page,
            numPage: Math.ceil(results.length / pageSize),
            total: results.length
        });
    } catch (err) {
        return next(err)
    }
};

exports.retrieve = (req, res) => {
    return res.json(req.instance)
};

exports.update = (req, res) => {
    let data = getBody(req, ['title', 'fields']);
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


exports.deleteData = async (req, res) => {
    let tasks = await TaskModel.find({campaign: req.instance})
    let tasksId = tasks.map(x => ObjectId(x._id))
    await DataModel.deleteMany({task: {$in: tasksId}})
    return res.sendStatus(204);
};
