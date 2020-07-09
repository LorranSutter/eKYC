const Client = require('../models/client');
const Fi = require('../models/fi');

exports.clientCreate = async function (login, password, ledgerId) {
    const newClient = new Client({
        login,
        password,
        ledgerId
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
    });
};