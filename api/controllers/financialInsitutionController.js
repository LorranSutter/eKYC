const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/client');
const io = require('../db/io');
const networkConnection = require('../utils/networkConnection');

// exports.create = (req, res) => {

//     const { login, password, name, idNumber } = req.body;
//     const fiData = JSON.stringify({ name, idNumber });

//     networkConnection
//         .submitTransaction('createFinancialInstitution', [fiData])
//         .then(async result => {
//             if (result) {
//                 await io.userCreate(login, password, 'fi', result.toString());
//                 return res.json({ result: 'Financial institution created', ledgerId: result.toString() });
//             }
//             return res.status(500).json({ error: 'Something went wrong' });
//         })
//         .catch((err) => {
//             return res.status(500).json({ error: `Something went wrong\n ${err}` });
//         });
// };

exports.createClient = (req, res) => {

    const { login, password, name, dateOfBirth, address, idNumber } = req.body;
    const clientData = JSON.stringify({ name, dateOfBirth, address, idNumber });

    networkConnection
        .submitTransaction('createClient', req.query.orgNum, req.query.ledgerUser, [clientData])
        .then(async result => {
            if (result) {
                await io.clientCreate(login, password, result.toString());
                return res.json({ result: 'Client created', ledgerId: result.toString() });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.login = async (req, res) => {

    const { login, password, userType } = req.body;

    if (!login || !password) {
        return res.status(401).json({ message: 'Invalid login/password' });
    }

    const fi = await User.findOne({ login });
    if (!fi) {
        return res.status(401).json({ message: 'Invalid login' });
    }

    if (fi.userType !== userType) {
        return res.status(401).json({ message: 'Invalid login' });
    }

    const isMatch = await bcrypt.compare(password, fi.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const userJWT = jwt.sign({ login }, process.env.PRIVATE_KEY, { algorithm: 'HS256' });

    return res.json({ userJWT, ledgerId: fi.ledgerId });
};

exports.getFiData = (req, res) => {
    networkConnection
        .evaluateTransaction('getFinancialInstitutionData', [req.cookies.ledgerId])
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    return res.json({ fiData: JSON.parse(result.toString()) });
                }
                return res.json({ fiData: result.toString() });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.getClientData = (req, res) => {

    const { orgNum, ledgerUser, clientId, fields } = req.query;

    networkConnection
        .evaluateTransaction('getClientData', orgNum, ledgerUser, [clientId, fields || []])
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

exports.getApprovedClients = async (req, res) => {
    networkConnection
        .evaluateTransaction('getRelationByFi', [req.cookies.ledgerId])
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    return res.json({ approvedClients: JSON.parse(result.toString()) });
                }
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};