'use strict';

const User = require('../models/user');

exports.userCreate = async function (login, password, userType, ledgerId) {
    const newUser = new User({
        login,
        password,
        userType,
        ledgerId
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('New user: ' + newUser.login);
    });
};