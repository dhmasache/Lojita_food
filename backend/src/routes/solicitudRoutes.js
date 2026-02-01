const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Rutas para Clientes ---
// Crear una nueva solicitud para ser propietario. Requiere estar logueado como cliente.
router.post('/', protect, authorize('cliente'), solicitudController.createSolicitud);


// --- Rutas para Administradores ---
// Obtener todas las solicitudes.
router.get('/', protect, authorize('admin'), solicitudController.getSolicitudes);

// Aprobar una solicitud.
router.put('/:id/aprobar', protect, authorize('admin'), solicitudController.approveSolicitud);

// Rechazar una solicitud.
router.put('/:id/rechazar', protect, authorize('admin'), solicitudController.rejectSolicitud);


module.exports = router;
