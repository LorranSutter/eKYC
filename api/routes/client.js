const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');

router.post('/create', clientController.create);

router.post('/login', clientController.login);

router.post('/getClientData', clientController.getClientData);

router.post('/approve', clientController.approve);

module.exports = router;
