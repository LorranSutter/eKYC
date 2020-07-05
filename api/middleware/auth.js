const jwt = require('jsonwebtoken');

exports.checkLogin = (req, res, next) => {
    const userToken = req.cookies.userJWT;

    if (!userToken) {
        res.status(401).send({ message: 'Invalid login/password' });
    }

    try {
        jwt.verify(userToken, process.env.PRIVATE_KEY);
    } catch (error) {
        res.status(401).send({ message: 'Invalid login/password' });
    }

    next();
};