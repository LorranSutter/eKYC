const express = require('express');
const router = express.Router();

const financialInsitutionController = require('../controllers/financialInsitutionController');
const { checkLogin } = require('../middleware/auth');
const fiValidator = require('../middleware/fiValidator');
const { validate } = require('../middleware/validate');
const credentials = require('../middleware/credentials');

router.post('/createClient',
    fiValidator.registration,
    validate,
    credentials.getOrgCredentials,
    financialInsitutionController.createClient);

router.post('/login',
    fiValidator.login,
    validate,
    financialInsitutionController.login);

router.get('/getFiData',
    checkLogin,
    credentials.getOrgCredentials,
    financialInsitutionController.getFiData);

router.get('/getClientData',
    checkLogin,
    credentials.getOrgCredentials,
    financialInsitutionController.getClientData);

router.get('/getApprovedClients',
    checkLogin,
    credentials.getOrgCredentials,
    financialInsitutionController.getApprovedClients);

module.exports = router;
