const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const networkConnection = require('../utils/networkConnection');

exports.login = async (req, res) => {

    const { login, password, userType } = req.body;

    if (!login || !password) {
        return res.status(401).json({ message: 'Invalid login/password' });
    }

    const client = await User.findOne({
        $and:
            [
                { login },
                { userType }
            ]
    });
    if (!client) {
        return res.status(401).json({ message: 'Invalid login' });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const userJWT = jwt.sign({ login }, process.env.PRIVATE_KEY, { algorithm: 'HS256' });

    return res.json({ userJWT, ledgerId: client.ledgerId, whoRegistered: client.whoRegistered });
};

exports.getClientData = (req, res) => {

    const { fields } = req.query;

    // TODO Use cookies
    networkConnection
        .evaluateTransaction('getClientData', req.orgNum, req.ledgerUser, [req.query.ledgerId, fields || []])
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    return res.json({ clientData: JSON.parse(Buffer.from(result.toString())) });
                }
                return res.json({ clientData: result.toString() });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.approve = async (req, res) => {
    // TODO Use cookies
    networkConnection
        .submitTransaction('approve', req.orgNum, req.ledgerUser, [req.query.ledgerId, req.query.fiId])
        .then(result => {
            if (result) {
                return res.json({ message: `Financial Institution ${req.query.fiId} approved by ${req.cookies.ledgerId}` });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.remove = async (req, res) => {
    // TODO Use cookies
    networkConnection
        .submitTransaction('remove', req.orgNum, req.ledgerUser, [req.query.ledgerId, req.query.fiId])
        .then(result => {
            if (result) {
                return res.json({ message: `Financial Institution ${req.query.fiId} removed by ${req.cookies.ledgerId}` });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.getApprovedFis = async (req, res) => {
    // TODO Use cookies
    networkConnection
        .evaluateTransaction('getRelationByClient', req.orgNum, req.ledgerUser, [req.query.ledgerId])
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    return res.json({ approvedFis: JSON.parse(result.toString()) });
                }
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};