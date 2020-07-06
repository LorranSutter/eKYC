const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');
const { checkLogin } = require('../middleware/auth');
const clientValidator = require('../middleware/clientValidator');
const { validate } = require('../middleware/validate');

router.post('/create', clientValidator.registration, validate, clientController.create);

router.post('/login', clientValidator.login, validate, clientController.login);

router.get('/getClientData', checkLogin, clientController.getClientData);

router.get('/approve', checkLogin, clientController.approve);

router.get('/getApprovedFis', checkLogin, clientController.getApprovedFis);

module.exports = router;
