const express = require('express');
const router = express.Router();
const platoController = require('../controllers/platoController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Importar
const upload = require('../lib/multerConfig'); // Importar

// Crear un nuevo plato
router.post('/', protect, authorize('admin', 'propietario'), upload.single('imagenPlato'), platoController.createPlato); // Añadir protect y authorize aquí también

// Subir imagen para un plato (Solo Admin y Propietario del restaurante)
router.post('/:id/upload-image', protect, authorize('admin', 'propietario'), upload.single('dishImage'), platoController.uploadPlatoImage);

// Obtener todos los platos
router.get('/', platoController.getPlatos);

// Obtener un plato por ID
router.get('/:id', platoController.getPlatoById);

// Actualizar un plato por ID
router.put('/:id', platoController.updatePlato);

// Eliminar un plato por ID
router.delete('/:id', platoController.deletePlato);

module.exports = router;
