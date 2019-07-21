const {UserModel} = require('core-model');
const {responseJSON, responseError} = require('./response');
const {getBody, getParam} = require('./request');
var passport = require('passport');

exports.create = (req, res) => {
    let data = getBody(req, ['username', 'password', 'name', 'email']);
    return UserModel.findOne({username: data.username})
        .then(user => {
            if (user) {
                return responseError(res, 'User has been existed', {messageCode: 'user_existed'}, 405);
            } else {
                let newUser = new UserModel()
                newUser.username = data.username;
                newUser.name = data.name;
                newUser.email = data.email;
                newUser.setPassword(data.password);
                newUser.save()
            }
        })
        .then(created => {
            return responseJSON(res, 'Create user successfully', created);
        })
        .catch(error => {
            let message = error && error.message ? error.message : 'Error when create user';
            return responseError(res, message, {messageCode: 'error_create_user'});
        });
};

exports.list = (req, res) => {
    return UserModel.find({})
        .then(users => {
            return responseJSON(res, 'Get all user successfully', users);
        })
        .catch(error => {
            let message = error && error.message ? error.message : 'Error when get all users';
            return responseError(res, message, {messageCode: 'error_get_all_user'});
        });
};

exports.retrieve = (req, res) => {
    let username = getParam(req, 'username');
    return UserModel.findOne({username: username})
        .then(user => {
            if (!user) return responseError(res, 'User has not been existed', {messageCode: 'user_not_existed'}, 404);
            else return responseJSON(res, 'Get user successfully', user);
        })
        .catch(error => {
            let message = error && error.message ? error.message : 'Error when get user';
            return responseError(res, message, {messageCode: 'error_get_user'});
        });
};

exports.update = (req, res) => {
    let username = getParam(req, 'username');
    let name = getBody(req, 'name');
    return UserModel.findOne({username: username})
        .then(user => {
            if (!user) return responseError(res, 'User has not been existed', {messageCode: 'user_not_existed'}, 404);
            else return user.update({name: name});
        })
        .then(updated => {
            return responseJSON(res, 'Update user successfully', updated);
        })
        .catch(error => {
            let message = error && error.message ? error.message : 'Error when get users';
            return responseError(res, message, {messageCode: 'error_get_user'});
        });
};

exports.delete = (req, res) => {
    let username = getParam(req, 'username');
    return UserModel.findOne({username: username})
        .then(user => {
            if (!user) return responseError(res, 'User has not been existed', {messageCode: 'user_not_existed'}, 404);
            else return user.remove();
        })
        .then(updated => {
            return responseJSON(res, 'Update user successfully', updated);
        })
        .catch(error => {
            let message = error && error.message ? error.message : 'Error when get users';
            return responseError(res, message, {messageCode: 'error_get_user'});
        });
};

exports.me = (req, res, next) => {
    UserModel.findById(req.payload.id).then(function (user) {
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json(user);
    }).catch(next);
};

exports.login = (req, res, next) => {
    let data = getBody(req, ['email', 'password']);
    if (!data.email) {
        return res.status(422).json({errors: {email: "can't be blank"}});
    }

    if (!data.password) {
        return res.status(422).json({errors: {password: "can't be blank"}});
    }
    passport.authenticate('local', {session: false}, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            user.token = user.generateJWT();
            return res.json(user.toAuthJSON());
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
}
