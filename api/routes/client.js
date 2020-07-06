const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');
const { checkLogin } = require('../middleware/auth');
const clientValidator = require('../middleware/clientValidator');
const { validate } = require('../middleware/validate');

router.post('/create', clientValidator.registration, validate, clientController.create);

router.post('/login', clientValidator.login, validate, clientController.login);

router.post('/getClientData', checkLogin, clientController.getClientData);

router.post('/approve', checkLogin, clientController.approve);

router.post('/getApprovedFis', checkLogin, clientController.getApprovedFis);

module.exports = router;
