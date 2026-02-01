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
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, 'tu_super_secreto', {
            expiresIn: '8h'
        });

        // Excluir password de la respuesta
        const { password: _, ...usuarioSinPassword } = usuario.get({ plain: true });

        res.json({
            mensaje: 'Login exitoso',
            token: token,
            usuario: usuarioSinPassword
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario (Registro público)
exports.createUsuario = async (req, res) => {
    try {
        // El rol se asigna por defecto a 'cliente' según el modelo.
        // Nos aseguramos de ignorar cualquier intento de auto-asignarse un rol privilegiado.
        const { nombre, email, password } = req.body;
        const usuario = await Usuario.create({ nombre, email, password, rol: 'cliente' });
        
        // Excluir password de la respuesta
        const { password: _, ...usuarioSinPassword } = usuario.get({ plain: true });
        
        res.status(201).json(usuarioSinPassword);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los usuarios (Solo Admin)
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID (Solo Admin)
exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un usuario por ID (El propio usuario o un Admin)
exports.updateUsuario = async (req, res) => {
    try {
        // Un usuario no-admin no puede cambiar su propio rol.
        if (req.usuario.rol !== 'admin') {
            delete req.body.rol;
        }

        // Un usuario solo puede modificarse a sí mismo, a menos que sea admin.
        if (req.usuario.rol !== 'admin' && req.usuario.id.toString() !== req.params.id) {
            return res.status(403).json({ error: 'Acceso denegado. No puedes modificar otros usuarios.' });
        }
        
        const [updated] = await Usuario.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated) {
            const updatedUsuario = await Usuario.findByPk(req.params.id, {
                attributes: { exclude: ['password'] }
            });
            res.json(updatedUsuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un usuario por ID (Solo Admin)
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

// Cambiar rol de un usuario (Solo Admin)
exports.updateUserRole = async (req, res) => {
    try {
        const { rol } = req.body;
        if (!rol || !['cliente', 'propietario', 'admin'].includes(rol)) {
            return res.status(400).json({ error: 'Rol inválido.' });
        }

        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        usuario.rol = rol;
        await usuario.save();
        
        const { password: _, ...usuarioSinPassword } = usuario.get({ plain: true });

        res.json(usuarioSinPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
