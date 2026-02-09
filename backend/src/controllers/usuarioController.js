const { Usuario, Alergia, UsuarioAlergia, sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../lib/mailer');
const crypto = require('crypto');

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si la cuenta ha sido verificada
        if (!usuario.isVerified) {
            return res.status(403).json({ error: 'Tu cuenta no ha sido verificada. Por favor, revisa tu correo electrónico.' });
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

        // Enviar correo de notificación de inicio de sesión exitoso
        await sendEmail({
            to: usuario.email,
            subject: '¡Inicio de Sesión Exitoso en LojitaFood!',
            html: `
                <h1>¡Hola de nuevo, ${usuario.nombre}!</h1>
                <p>Hemos detectado un inicio de sesión exitoso en tu cuenta de LojitaFood.</p>
                <p>¡Estamos muy felices de que sigas usando nuestra aplicación!</p>
                <p>Si no fuiste tú quien inició sesión, por favor contacta a soporte inmediatamente.</p>
                <br>
                <p>Atentamente,</p>
                <p>El equipo de LojitaFood</p>
            `
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario (Registro público)
exports.createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, selectedAlergiaIds } = req.body;

        // Generar código de verificación
        const verificationCode = crypto.randomInt(100000, 999999).toString();

        const usuario = await Usuario.create({ 
            nombre, 
            email, 
            password, 
            rol: 'cliente',
            verificationCode 
        });
        
        // Asegurarse de que selectedAlergiaIds sea un array
        const parsedAlergiaIds = Array.isArray(selectedAlergiaIds) ? selectedAlergiaIds : (selectedAlergiaIds ? [selectedAlergiaIds] : []);
        if (parsedAlergiaIds.length > 0) {
            await usuario.setAlergias(parsedAlergiaIds);
        }
        
        // Enviar correo de verificación
        await sendEmail({
            to: email,
            subject: '¡Bienvenido a LojitaFood! Confirma tu cuenta',
            html: `
                <h1>¡Hola, ${nombre}!</h1>
                <p>Gracias por registrarte en LojitaFood. Estamos muy contentos de tenerte con nosotros.</p>
                <p>Para activar tu cuenta, por favor usa el siguiente código de verificación:</p>
                <h2>${verificationCode}</h2>
                <p>Si no te registraste en nuestra aplicación, por favor ignora este correo.</p>
                <br>
                <p>Atentamente,</p>
                <p>El equipo de LojitaFood</p>
            `
        });

                res.status(201).json({
                    message: 'Usuario registrado con éxito. Por favor, revisa tu correo para verificar tu cuenta.'
                });
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return res.status(400).json({ error: 'El email ya está registrado.' });
                }
                if (error.name === 'SequelizeValidationError') {
                    const errors = error.errors.map(err => err.message);
                    return res.status(400).json({ error: errors.join(', ') });
                }
                res.status(400).json({ error: error.message });
            }};

// Obtener todos los usuarios (Solo Admin)
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] },
            include: [{ model: Alergia, attributes: ['id', 'nombre'], through: { attributes: [] } }]
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID (Solo Admin o el propio usuario)
exports.getUsuarioById = async (req, res) => {
    try {
        // Un usuario puede obtener su propio perfil, o un admin puede obtener cualquier perfil
        if (req.usuario.rol !== 'admin' && req.usuario.id.toString() !== req.params.id) {
            return res.status(403).json({ error: 'Acceso denegado. No puedes ver el perfil de otros usuarios.' });
        }

        const usuario = await Usuario.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Alergia, attributes: ['id', 'nombre'], through: { attributes: [] } }]
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
        const usuarioIdToUpdate = req.params.id;
        const { nombre, email, telefono, password, selectedAlergiaIds } = req.body;
        let updateData = { nombre, email, telefono };

        // Autorización: un usuario solo puede modificarse a sí mismo, a menos que sea admin.
        if (req.usuario.rol !== 'admin' && req.usuario.id.toString() !== usuarioIdToUpdate) {
            return res.status(403).json({ error: 'Acceso denegado. No puedes modificar otros usuarios.' });
        }

        // Un usuario no-admin no puede cambiar su propio rol.
        if (req.usuario.rol !== 'admin') {
            delete req.body.rol; // Asegurarse de que el rol no se pueda modificar por un no-admin
        }
        
        // Manejar la actualización de contraseña si se proporciona
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Manejar imagen de perfil si se sube un archivo
        if (req.file) {
            updateData.imagenPerfil = `/uploads/${req.file.filename}`;
        } else if (req.body.imagenPerfil === 'null') { // Si se envía 'null' para borrar la imagen
            updateData.imagenPerfil = null;
        }


        const [updated] = await Usuario.update(updateData, {
            where: { id: usuarioIdToUpdate },
            individualHooks: true // Para que los hooks 'beforeUpdate' se ejecuten
        });

        if (updated) {
            const updatedUsuario = await Usuario.findByPk(usuarioIdToUpdate, {
                attributes: { exclude: ['password'] }
            });
            // Asegurarse de que selectedAlergiaIds sea un array
            const parsedAlergiaIds = Array.isArray(selectedAlergiaIds) ? selectedAlergiaIds : (selectedAlergiaIds ? [selectedAlergiaIds] : []);
            if (parsedAlergiaIds.length > 0) {
                await updatedUsuario.setAlergias(parsedAlergiaIds);
            } else {
                await updatedUsuario.setAlergias([]); // Clear all associations if none selected
            }
            res.json(updatedUsuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado o no se realizaron cambios.' });
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'El email ya está registrado.' });
        }
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
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

// Verificar la cuenta de usuario con el código
exports.verifyAccount = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        if (usuario.isVerified) {
            return res.status(400).json({ error: 'Esta cuenta ya ha sido verificada.' });
        }

        if (usuario.verificationCode !== verificationCode) {
            return res.status(400).json({ error: 'Código de verificación incorrecto.' });
        }

        // Marcar la cuenta como verificada
        usuario.isVerified = true;
        usuario.verificationCode = null; // Limpiar el código después de usarlo
        await usuario.save();

        res.json({ message: '¡Tu cuenta ha sido verificada con éxito! Ya puedes iniciar sesión.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Solicitar restablecimiento de contraseña
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ error: 'No existe un usuario con ese correo electrónico.' });
        }

        // Generar token de restablecimiento
        const resetToken = crypto.randomBytes(32).toString('hex');
        usuario.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        usuario.passwordResetExpires = Date.now() + 3600000; // 1 hora de validez
        
        await usuario.save();

        // URL para el frontend (deberás configurarla en el frontend)
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`; // TODO: Reemplazar con la URL real de tu frontend

        await sendEmail({
            to: usuario.email,
            subject: 'Restablecimiento de Contraseña para LojitaFood',
            html: `
                <h1>Hola, ${usuario.nombre}</h1>
                <p>Has solicitado restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para hacerlo:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste esto, por favor ignora este correo.</p>
            `
        });

        res.status(200).json({ message: 'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.' });

    } catch (error) {
        usuario.passwordResetToken = undefined;
        usuario.passwordResetExpires = undefined;
        await usuario.save();
        res.status(500).json({ error: error.message });
    }
};

// Restablecer contraseña
exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const usuario = await Usuario.findOne({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: { [Usuario.sequelize.Op.gt]: Date.now() } // Token no expirado
            }
        });

        if (!usuario) {
            return res.status(400).json({ error: 'El token de restablecimiento es inválido o ha expirado.' });
        }

        // Actualizar contraseña
        usuario.password = req.body.password; // El hook beforeUpdate se encargará de hashear la contraseña
        usuario.passwordResetToken = null;
        usuario.passwordResetExpires = null;
        await usuario.save();

        res.status(200).json({ message: 'Tu contraseña ha sido restablecida con éxito.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};