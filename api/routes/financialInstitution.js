const express = require('express');
const router = express.Router();

const financialInsitutionController = require('../controllers/financialInsitutionController');
const { checkLogin } = require('../middleware/auth');
const fiValidator = require('../middleware/fiValidator');
const { validate } = require('../middleware/validate');

router.post('/create', fiValidator.registration, validate, financialInsitutionController.create);

router.post('/login', fiValidator.login, validate, financialInsitutionController.login);

router.get('/getClientDataByFI', checkLogin, financialInsitutionController.getClientDataByFI);

router.get('/getApprovedClients', checkLogin, financialInsitutionController.getApprovedClients);

router.get('/getFiData', checkLogin, financialInsitutionController.getFiData);

module.exports = router;
