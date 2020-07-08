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

    const { login, password, userType } = req.body;

    if (!login || !password) {
        return res.status(401).json({ message: 'Invalid login/password' });
    }

    const client = await User.findOne({ login });
    if (!client) {
        return res.status(401).json({ message: 'Invalid login' });
    }

    if(client.userType !== userType){
        return res.status(401).json({ message: 'Invalid login' });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const userJWT = jwt.sign({ login }, process.env.PRIVATE_KEY, { algorithm: 'HS256' });

    return res.json({ userJWT, ledgerId: client.ledgerId });
};

exports.getClientData = (req, res) => {

    const fields = req.body.fields || [];

    networkConnection
        .evaluateTransaction('getClientData', [req.cookies.ledgerId, fields])
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    // FIXME Figure out a better way to parse client data
                    let data = JSON.parse(result.toString()).data;
                    data = JSON.parse(Buffer.from(data));
                    return res.json({ clientData: data });
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
    networkConnection
        .submitTransaction('approve', [req.query.ledgerId, req.query.fiId])
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

exports.getApprovedFis = async (req, res) => {
    networkConnection
        .evaluateTransaction('getRelationByClient', [req.query.ledgerId])
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

// exports.getApprovedFis2 = async (req, res) => {
//     networkConnection
//         .evaluateTransaction('getRelationByClient2', [req.body.clientId, req.body.fiId])
//         .then(result => {
//             if (result) {
//                 if (result.length > 0) {
//                     return res.json({ approvedFis: JSON.parse(result.toString()) });
//                 }
//             }
//             return res.status(500).json({ error: 'Something went wrong' });
//         })
//         .catch((err) => {
//             return res.status(500).json({ error: `Something went wrong\n ${err}` });
//         });
// };

exports.remove = async (req, res) => {
    networkConnection
        .submitTransaction('remove', [req.query.ledgerId, req.query.fiId])
        .then(result => {
            console.log(result);
            if (result) {
                console.log(result);
                return res.json({ message: `Financial Institution ${req.query.fiId} removed by ${req.query.ledgerId}` });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};