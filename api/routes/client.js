const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');
const { checkLogin } = require('../middleware/auth');
const clientValidator = require('../middleware/clientValidator');
const { validate } = require('../middleware/validate');
const credentials = require('../middleware/credentials');

// router.post('/create', clientValidator.registration, validate, clientController.create);

router.post('/login', clientValidator.login, validate, clientController.login);

// TODO Restore checkLogin
router.get('/getClientData',
    credentials.getWhoRegistered,
    clientController.getClientData);

// TODO Restore checkLogin
router.get('/approve',
    credentials.getWhoRegistered,
    clientController.approve);

// TODO Restore checkLogin
router.get('/remove',
    credentials.getWhoRegistered,
    clientController.remove);

// TODO Restore checkLogin
router.get('/getApprovedFis',
    credentials.getWhoRegistered,
    clientController.getApprovedFis);

module.exports = router;
