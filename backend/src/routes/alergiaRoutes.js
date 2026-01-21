const express = require('express');
const router = express.Router();
const alergiaController = require('../controllers/alergiaController');

// Endpoints para alergias
router.get('/', alergiaController.getAlergias);
router.post('/', alergiaController.createAlergia);

module.exports = router;