var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy(function (username, password, done) {
    console.log(username);
    console.log(password);
    User.findOne({username: username}).then(function (user) {
        if (!user || !user.validPassword(password)) {
            return done(null, false, {errors: {'email or password': 'is invalid'}});
        }

        return done(null, user);
    }).catch(done);
}));
