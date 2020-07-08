const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');
const { checkLogin } = require('../middleware/auth');
const clientValidator = require('../middleware/clientValidator');
const { validate } = require('../middleware/validate');

router.post('/create', clientValidator.registration, validate, clientController.create);

router.post('/login', clientValidator.login, validate, clientController.login);

router.get('/getClientData', checkLogin, clientController.getClientData);

// router.get('/approve', clientController.approve);

// router.get('/remove', clientController.remove);

// router.get('/getApprovedFis', clientController.getApprovedFis);

// router.get('/getApprovedFis2', clientController.getApprovedFis2);

module.exports = router;
