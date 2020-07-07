const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');

const clientRouter = require('./routes/client');
const financialInstitutionRouter = require('./routes/financialInstitution');

const app = express();

app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/client', clientRouter);
app.use('/fi', financialInstitutionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

module.exports = app;