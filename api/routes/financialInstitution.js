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

router.post('/login', fiValidator.login, validate, financialInsitutionController.login);

// TODO Restore checkLogin
router.get('/getClientData',
    credentials.getOrgCredentials,
    financialInsitutionController.getClientData);

// TODO Restore checkLogin
router.get('/getApprovedClients',
    credentials.getOrgCredentials,
    financialInsitutionController.getApprovedClients);

// TODO Restore checkLogin
router.get('/getFiData',
    credentials.getOrgCredentials,
    financialInsitutionController.getFiData);

module.exports = router;
