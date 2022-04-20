require('express-async-errors');
require('dotenv').config();
require('./db/client');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
const cors = require('cors');

const userRouter = require('./routes/user.router');
const authRouter = require('./routes/auth.router');

app.use(cors({ exposedHeaders: 'x-authorization-token' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', authRouter);
app.use('/v1/user', userRouter);

module.exports = app;

