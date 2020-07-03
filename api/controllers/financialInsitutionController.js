'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.create = (req, res, next) => {

    // TODO Register new financial institution on couchdb
    res.status(201).json({ message: 'User created' });
};

exports.login = async (req, res) => {

    const name = req.body.name;
    const password = req.body.password;

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

    res.status(200).json({ fiJWT });
};