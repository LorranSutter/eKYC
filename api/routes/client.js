const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');
const { checkLogin } = require('../middleware/auth');
const clientValidator = require('../middleware/clientValidator');
const { validate } = require('../middleware/validate');

// router.post('/create', clientValidator.registration, validate, clientController.create);

router.post('/login', clientValidator.login, validate, clientController.login);

router.post('/getClientData', checkLogin, clientController.getClientData);

// TODO Restore checkLogin
router.get('/approve', clientController.approve);

router.get('/remove', checkLogin, clientController.remove);

// TODO Restore checkLogin
router.get('/getApprovedFis', clientController.getApprovedFis);

module.exports = router;
