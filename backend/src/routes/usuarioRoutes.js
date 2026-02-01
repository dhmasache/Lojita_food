const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Rutas Públicas ---
// Registro de un nuevo usuario
router.post('/', usuarioController.createUsuario);
// Login de usuario
router.post('/login', usuarioController.login);


// --- Rutas Protegidas (Requieren Login) ---
// Actualizar un usuario por ID (el usuario mismo o un admin)
// La lógica de si es el mismo usuario o admin se hará en el controlador.
router.put('/:id', protect, usuarioController.updateUsuario);


// --- Rutas de Administrador ---
// Obtener todos los usuarios
router.get('/', protect, authorize('admin'), usuarioController.getUsuarios);

// Obtener un usuario por ID
router.get('/:id', protect, authorize('admin'), usuarioController.getUsuarioById);

// Eliminar un usuario por ID
router.delete('/:id', protect, authorize('admin'), usuarioController.deleteUsuario);

// Cambiar el rol de un usuario
router.put('/:id/cambiar-rol', protect, authorize('admin'), usuarioController.updateUserRole);


module.exports = router;
