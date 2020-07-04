const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const io = require('../db/io');
const networkConnection = require('../utils/networkConnection');

exports.create = (req, res, next) => {

    const { login, password, firstName, lastName, id } = req.body;

    networkConnection
        .submitTransaction('createClient', [firstName, lastName, id])
        .then(async result => {
            if (result) {
                await io.userCreate(login, password, 'client', result.ledgerId);
                return res.json({ result: 'Client created', ledgerId: result.ledgerId });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.login = async (req, res) => {

    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(401).json({ message: 'Invalid name/password' });
    }

    const client = await User.findOne({ name });
    if (!client) {
        return res.status(401).json({ message: 'Invalid name' });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const clientJWT = jwt.sign({ name }, process.env.PRIVATE_KEY, { algorithm: 'HS256' });

    return res.json({ clientJWT, ledgerId: client.ledgerId });
};

exports.getClientData = (req, res) => {
    networkConnection
        .evaluateTransaction('getClientData', [req.query.ledgerId])
        .then(result => {
            if (result) {
                return res.json({ clientData: result });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.approve = async (req, res) => {

    // TODO Approve FI to access client data
    networkConnection
        .submitTransaction('approve', [req.query.clientId, req.query.fiId])
        .then(result => {
            if (result) {
                return res.json({ message: `FI ${req.query.fiId} approved` });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};