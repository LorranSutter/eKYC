const User = require('../models/user');

exports.clientCreate = async function (login, password, ledgerId, whoRegistered) {
    const newClient = new User({
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
    });
};

exports.fiCreate = async function (login, password, ledgerId, ledgerUser, orgNum) {
    const newFi = new User({
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
    });
};