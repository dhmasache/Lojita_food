const express = require('express');
const router = express.Router();
const cantonController = require('../controllers/cantonController');

// Crear un nuevo cantón
router.post('/', cantonController.createCanton);

// Obtener todos los cantones
router.get('/', cantonController.getCantones);

// Obtener un cantón por ID
router.get('/:id', cantonController.getCantonById);

// Actualizar un cantón por ID
router.put('/:id', cantonController.updateCanton);

// Eliminar un cantón por ID
router.delete('/:id', cantonController.deleteCanton);

module.exports = router;
