const express = require('express');
const router = express.Router();

const financialInsitutionController = require('../controllers/financialInsitutionController');
const { checkLogin } = require('../middleware/auth');
const fiValidator = require('../middleware/fiValidator');
const { validate } = require('../middleware/validate');

router.post('/createClient', checkLogin, fiValidator.registration, validate, financialInsitutionController.createClient);

router.post('/login', fiValidator.login, validate, financialInsitutionController.login);

// TODO Restore checkLogin
router.get('/getClientData', financialInsitutionController.getClientData);

// TODO Restore checkLogin
router.get('/getApprovedClients', financialInsitutionController.getApprovedClients);

// TODO Restore checkLogin
router.get('/getFiData', financialInsitutionController.getFiData);

module.exports = router;
