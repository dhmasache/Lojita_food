const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Crear un nuevo usuario
router.post('/', usuarioController.createUsuario);

// Obtener todos los usuarios
router.get('/', usuarioController.getUsuarios);

// Obtener un usuario por ID
router.get('/:id', usuarioController.getUsuarioById);

// Actualizar un usuario por ID
router.put('/:id', usuarioController.updateUsuario);

// Eliminar un usuario por ID
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;
