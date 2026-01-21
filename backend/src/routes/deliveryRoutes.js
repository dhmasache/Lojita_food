const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Endpoints para apps de delivery
router.get('/', deliveryController.getDeliveryApps);
router.post('/', deliveryController.createDeliveryApp);

module.exports = router;