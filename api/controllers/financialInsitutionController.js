'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const io = require('../db/io');
const networkConnection = require('../utils/networkConnection');

exports.create = (req, res, next) => {

    const { login, password, name, id } = req.body;

    networkConnection
        .submitTransaction('createFinancialInstitution', [name, id])
        .then(async result => {
            if (result) {
                await io.userCreate(login, password, 'fi', result.ledgerId);
                return res.json({ result: 'Financial institution created', ledgerId: result.ledgerId });
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

    const fi = await User.findOne({ name });
    if (!fi) {
        return res.status(401).json({ message: 'Invalid name' });
    }

    const isMatch = await bcrypt.compare(password, fi.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const fiJWT = jwt.sign({ name }, process.env.PRIVATE_KEY, { algorithm: 'HS256' });

    return res.json({ fiJWT, ledgerId: fi.ledgerId });
};

exports.getClientData = (req, res) => {

    const { clientId } = req.body;

    networkConnection
        .evaluateTransaction('getClientData', [clientId, req.query.fiId])
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