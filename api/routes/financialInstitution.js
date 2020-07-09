const express = require('express');
const router = express.Router();

const financialInsitutionController = require('../controllers/financialInsitutionController');
const { checkLogin } = require('../middleware/auth');
const fiValidator = require('../middleware/fiValidator');
const { validate } = require('../middleware/validate');

// router.post('/create', fiValidator.registration, validate, financialInsitutionController.create);

router.post('/createClient', fiValidator.registration, validate, financialInsitutionController.createClient);

router.post('/login', fiValidator.login, validate, financialInsitutionController.login);

router.get('/getClientData', financialInsitutionController.getClientData);

router.get('/getApprovedClients', financialInsitutionController.getApprovedClients);

router.get('/getFiData', financialInsitutionController.getFiData);

module.exports = router;
