const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const esValido = await usuario.validPassword(password);

        if (!esValido) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token
        // NOTA: Es una mejor práctica guardar el 'secret' en una variable de entorno
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, 'tu_super_secreto', {
            expiresIn: '8h' // El token expira en 8 horas
        });

        res.json({
            mensaje: 'Login exitoso',
            token: token
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const usuario = await Usuario.create({ nombre, email, password, rol });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un usuario por ID
exports.updateUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const [updated] = await Usuario.update({ nombre, email, password, rol }, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedUsuario = await Usuario.findByPk(req.params.id);
            res.json(updatedUsuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un usuario por ID
exports.deleteUsuario = async (req, res) => {
    try {
        const deleted = await Usuario.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
