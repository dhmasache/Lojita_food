const express = require('express');
const router = express.Router();
const platoController = require('../controllers/platoController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../lib/multerConfig');

// Crear un nuevo plato
router.post('/', protect, authorize('admin', 'propietario'), upload.single('imagenPlato'), platoController.createPlato);

// Subir imagen para un plato (Esta ruta podría ser redundante si la imagen se actualiza con PUT /:id)
// La dejaremos por si se desea una actualización de imagen separada en el futuro.
// Por consistencia, cambiaremos el nombre del campo a 'imagenPlato'.
router.post('/:id/upload-image', protect, authorize('admin', 'propietario'), upload.single('imagenPlato'), platoController.uploadPlatoImage);

// Obtener todos los platos
router.get('/', platoController.getPlatos);

// Obtener un plato por ID
router.get('/:id', platoController.getPlatoById);

// Actualizar un plato por ID (Ahora con middleware para imagen)
router.put('/:id', protect, authorize('admin', 'propietario'), upload.single('imagenPlato'), platoController.updatePlato);

// Eliminar un plato por ID
router.delete('/:id', protect, authorize('admin', 'propietario'), platoController.deletePlato);

module.exports = router;