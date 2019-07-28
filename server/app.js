const cors = require('cors')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const httpLogger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
require('./helpers/load-env');

const whitelist = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://wwww.thefactwall.com',
    'https://wwww.thefactwall.com'
]

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

const app = express();
app.use(httpLogger('dev'));
app.use(bodyParser.json({
    verify(req, res, buf) {
        req.rawBody = buf;
    }
}));

app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}))

app.use(bodyParser.json({limit: process.env.LIMIT_UPLOAD}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./config/passport');

app.use(cors())
app.use('/api', require('./routes'));

const appSocket = require('express')();
const http = require('http').createServer(appSocket);

http.listen(process.env.WS_PORT, function () {
    console.log('listening on ' + process.env.WS_PORT);
});
let io = require('socket.io')(http);
io.on('connection', function (socket) {
    socket.emit('data', {'msg': 'hello'})
});

app.post('/api/run', function (req, res, next) {
    const {TaskModel} = require('core-model');
    const {crawler} = require('./crawler')
    TaskModel.findById(req.body.id)
        .then(function (instance) {
            if (!instance) {
                return res.sendStatus(404);
            }
            crawler(instance, io, req.body.isTest)
            return res.sendStatus(200);
        }).catch(next);
})

module.exports = app;
