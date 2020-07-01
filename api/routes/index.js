'use strict';

const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/queryCar', indexController.queryCar);

router.get('/queryAllCars', indexController.queryAllCars);

router.post('/createCar', indexController.createCar);

module.exports = router;
