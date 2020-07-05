const validator = require('express-validator');

exports.registration = [

    validator
        .body('login')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Login must be specified.')
        .matches(/^[\w\d ]+$/)
        .withMessage('Login has non-alphanumeric characters.')
        .escape(),
    validator
        .body('password')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Password must be specified.')
        .escape(),
    validator
        .body('name')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Name must be specified.')
        .matches(/^[\w\d ]+$/)
        .withMessage('Name has non-alphanumeric characters.')
        .escape(),
    validator
        .body('dateOfBirth', 'Invalid date of birth')
        .optional({ checkFalsy: true })
        .isISO8601()
        .escape(),
    validator
        .body('address')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Address must be specified.')
        .matches(/^[\w\d ]+$/)
        .withMessage('Name has non-alphanumeric characters.')
        .escape(),
    validator
        .body('idNumber')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Id number must be specified.')
        .matches(/^[\w\d ]+$/)
        .withMessage('Name has non-alphanumeric characters.')
        .escape()
];

exports.login = [

    validator
        .body('login')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Login must be specified.')
        .matches(/^[\w\d ]+$/)
        .withMessage('Login has non-alphanumeric characters.')
        .escape(),
    validator
        .body('password')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Password must be specified.')
        .escape()
];