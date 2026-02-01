const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restauranteController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Crear un nuevo restaurante (Solo Admin y Propietario)
router.post('/', protect, authorize('admin', 'propietario'), restauranteController.createRestaurante);

// Obtener todos los restaurantes (Público)
router.get('/', restauranteController.getRestaurantes);

// Obtener un restaurante por ID (Público)
router.get('/:id', restauranteController.getRestauranteById);

// Actualizar un restaurante por ID (Solo Admin y Propietario)
router.put('/:id', protect, authorize('admin', 'propietario'), restauranteController.updateRestaurante);

// Eliminar un restaurante por ID (Solo Admin y Propietario)
router.delete('/:id', protect, authorize('admin', 'propietario'), restauranteController.deleteRestaurante);

module.exports = router;
