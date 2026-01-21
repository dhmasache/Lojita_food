const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restauranteController');

// Crear un nuevo restaurante
router.post('/', restauranteController.createRestaurante);

// Obtener todos los restaurantes
router.get('/', restauranteController.getRestaurantes);

// Obtener un restaurante por ID
router.get('/:id', restauranteController.getRestauranteById);

// Actualizar un restaurante por ID
router.put('/:id', restauranteController.updateRestaurante);

// Eliminar un restaurante por ID
router.delete('/:id', restauranteController.deleteRestaurante);

module.exports = router;
