const crypt = require('../functions/crypt');

exports.getOrgCredentials = (req, res, next) => {
    // TODO Use cookies
    let orgCredentials = req.query.orgCredentials;
    orgCredentials = crypt.decrypt(orgCredentials);
    orgCredentials = JSON.parse(orgCredentials);

    req.orgNum = orgCredentials.orgNum;
    req.ledgerUser = orgCredentials.ledgerUser;

    next();
};

exports.getWhoRegistered = (req, res, next) => {
    // TODO Use cookies
    let whoRegistered = req.query.whoRegistered;
    whoRegistered = crypt.decrypt(whoRegistered);
    whoRegistered = JSON.parse(whoRegistered);

    req.orgNum = whoRegistered.orgNum;
    req.ledgerUser = whoRegistered.ledgerUser;

    next();
};