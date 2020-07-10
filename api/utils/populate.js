const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const async = require('async');
const mongoose = require('mongoose');

const Client = require('../models/client');
const Fi = require('../models/fi');
const networkConnection = require('./networkConnection');

const InitiateMongoServer = require('../db/connection');
const mongoURI = process.env.MONGODB_URI_DEV;

InitiateMongoServer(mongoURI);

function saveClient(login, password, ledgerId, whoRegistered, cb) {
    const newClient = new Client({
        login,
        password,
        ledgerId,
        whoRegistered
    });

    newClient.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('New client: ' + newClient.login);
        cb(null, newClient);
    });
}

function saveFi(login, password, ledgerId, ledgerUser, orgNum, cb) {
    const newFi = new Fi({
        login,
        password,
        ledgerId,
        ledgerUser,
        orgNum
    });

    newFi.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('New fi: ' + newFi.login);
        cb(null, newFi);
    });
}

function saveUser(user, cb) {
    if (user.Key.match(/^CLIENT\d+$/)) {
        saveClient(
            user.Record.name.replace(/ /g, ''),
            '123456',
            user.Key,
            user.Record.whoRegistered,
            cb);
    } else if (user.Key.match(/^FI\d+$/)) {
        saveFi(
            user.Record.name.replace(/ /g, ''),
            '123456',
            user.Key,
            user.Record.ledgerUser,
            user.Record.orgNum,
            cb);
    } else {
        console.log(`Oooppss... this user is non-standard ${user}`);
        return;
    }
}

function queryAllData(cb) {
    networkConnection
        .evaluateTransaction('queryAllData', process.argv[2], process.argv[3])
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