const express = require('express');
const router = express.Router();

const financialInsitutionController = require('../controllers/financialInsitutionController');

router.post('/create', financialInsitutionController.create);

router.post('/login', financialInsitutionController.login);

router.get('/getClientData', financialInsitutionController.getClientData);

module.exports = router;
