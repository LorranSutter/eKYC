const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const async = require('async');
const mongoose = require('mongoose');

const User = require('../models/user');
const networkConnection = require('./networkConnection');

const InitiateMongoServer = require('../db/connection');
const mongoURI = process.env.MONGODB_URI_DEV;

InitiateMongoServer(mongoURI);

function saveUser(user, cb) {
    let currentLogin, currentUserType;

    if (user.Key.match(/^CLIENT\d+$/)) {
        currentLogin = user.Record.firstName + user.Record.lastName;
        currentUserType = 'client';
    } else if (user.Key.match(/^FI\d+$/)) {
        currentLogin = user.Record.name;
        currentUserType = 'fi';
    } else {
        console.log(`Oooppss... this user is non-standard ${user}`);
        return;
    }

    const newUser = new User({
        login: currentLogin,
        password: '123456',
        userType: currentUserType,
        ledgerId: user.Key
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('New user: ' + newUser.login);
        cb(null, newUser);
    });
}

function queryAllData(cb) {
    networkConnection
        .evaluateTransaction('queryAllData')
        .then(users => {

            users = JSON.parse(users);

            async.parallel(
                users
                    .map(user =>
                        (cb) => saveUser(user, cb)
                    )
                , cb);
        });
}


function deleteDatabse(cb) {
    console.log('Deleting database');
    mongoose.connection.dropDatabase()
        .then(() => {
            console.log('Database deleted');
            cb();
        });
}

async.series(
    [
        deleteDatabse,
        queryAllData
    ],
    (err) => {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('Database populated successfully!');
        }
        mongoose.connection.close();
    });