const express = require('express');
const router = express.Router();
const reseniaController = require('../controllers/reseniaController');

// Crear una nueva reseña
router.post('/', reseniaController.createResenia);

// Obtener todas las reseñas
router.get('/', reseniaController.getResenias);

// Obtener una reseña por ID
router.get('/:id', reseniaController.getReseniaById);

// Actualizar una reseña por ID
router.put('/:id', reseniaController.updateResenia);

// Eliminar una reseña por ID
router.delete('/:id', reseniaController.deleteResenia);

module.exports = router;
