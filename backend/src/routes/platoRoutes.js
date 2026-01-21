const express = require('express');
const router = express.Router();
const platoController = require('../controllers/platoController');

// Crear un nuevo plato
router.post('/', platoController.createPlato);

// Obtener todos los platos
router.get('/', platoController.getPlatos);

// Obtener un plato por ID
router.get('/:id', platoController.getPlatoById);

// Actualizar un plato por ID
router.put('/:id', platoController.updatePlato);

// Eliminar un plato por ID
router.delete('/:id', platoController.deletePlato);

module.exports = router;
