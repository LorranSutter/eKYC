'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.create = (req, res, next) => {

    // TODO Register new user on couchdb
    res.status(201).json({ message: 'User created' });
};

exports.login = async (req, res) => {

    const name = req.body.name;
    const password = req.body.password;

    if (!name || !password) {
        return res.status(401).json({ message: 'Invalid name/password' });
    }

    // TODO Retrieve user data from couchdb
    const user = { name: 'name', password: 'password' };
    // if (!user) {
    //     return res.status(401).json({ message: 'Invalid name' });
    // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const userJWT = jwt.sign({ name }, process.env.PRIVATE_KEY, { algorithm: 'HS256' });

    res.status(200).json({ userJWT });
};