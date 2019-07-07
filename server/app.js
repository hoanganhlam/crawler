const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const httpLogger = require('morgan');
const bodyParser = require('body-parser');
require('./helpers/load-env');

const userRoute = require('./routes/userRoute');

const app = express();

app.use(httpLogger('dev'));
app.use(bodyParser.json({
	verify(req, res, buf) {
		req.rawBody = buf;
	}
}));
app.use(bodyParser.json({limit: process.env.LIMIT_UPLOAD}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRoute);

module.exports = app;
