const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const io = require('../db/io');
const networkConnection = require('../utils/networkConnection');

exports.create = (req, res) => {

    const { login, password, name, dateOfBirth, address, idNumber } = req.body;
    const clientData = JSON.stringify({ name, dateOfBirth, address, idNumber });

    networkConnection
        .submitTransaction('createClient', [clientData])
        .then(async result => {
            if (result) {
                await io.userCreate(login, password, 'client', result.toString());
                return res.json({ result: 'Client created', ledgerId: result.toString() });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.login = async (req, res) => {

    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(401).json({ message: 'Invalid login/password' });
    }

    const client = await User.findOne({ login });
    if (!client) {
        return res.status(401).json({ message: 'Invalid login' });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const clientJWT = jwt.sign({ login }, process.env.PRIVATE_KEY, { algorithm: 'HS256' });

    return res.json({ clientJWT, ledgerId: client.ledgerId });
};

exports.getClientData = (req, res) => {

    const fields = req.body.fields;

    networkConnection
        .evaluateTransaction('getClientData', [req.query.ledgerId, fields])
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    return res.json({ clientData: JSON.parse(result.toString()) });
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

    const { fiId } = req.body;

    networkConnection
        .submitTransaction('approve', [req.query.ledgerId, fiId])
        .then(result => {
            if (result) {
                return res.json({ message: `Financial Institution ${fiId} approved by ${req.query.ledgerId}` });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};