const { Restaurante, Usuario } = require('../models'); // Asegúrate de importar Usuario

// Crear un nuevo restaurante
exports.createRestaurante = async (req, res) => {
    try {
        let propietarioId;

        // Si el usuario logueado es admin y proporciona un propietarioId en el body, usarlo
        if (req.usuario && req.usuario.rol === 'admin' && req.body.propietarioId) {
            const owner = await Usuario.findByPk(req.body.propietarioId);
            if (!owner) {
                return res.status(400).json({ error: 'El propietarioId especificado no existe.' });
            }
            propietarioId = parseInt(req.body.propietarioId); // Asegurarse de que sea un número
        } else if (req.usuario) {
            // Si no es admin o no especifica propietarioId, usar el ID del usuario logueado
            propietarioId = req.usuario.id;
        } else {
            // Si no hay usuario logueado (esto debería ser manejado por auth middleware antes),
            // o si un admin decide no asignar un propietario al crear.
            // Por ahora, lo dejamos null si no hay un req.usuario y no es admin con propietarioId.
            // Considera si quieres permitir restaurantes sin propietario inicial.
            // El middleware de autenticación debería asegurar que req.usuario existe.
            return res.status(401).json({ error: 'Usuario no autenticado para crear un restaurante.' });
        }

        const { nombre, direccion, telefono, email, horarioApertura, horarioCierre, descripcion } = req.body;

        // Multer pone la información del archivo en req.file
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Convertir esTradicional de string a boolean
        const esTradicional = req.body.esTradicional === 'true'; // Asumiendo que viene como 'true' o 'false' del FormData

        const restaurante = await Restaurante.create({
            nombre,
            direccion,
            telefono,
            email: email || null, // Convertir cadena vacía a null para pasar validación isEmail con allowNull: true
            horarioApertura,
            horarioCierre,
            descripcion, // Nuevo campo
            esTradicional,
            imageUrl, // Nuevo campo
            propietarioId
        });
        res.status(201).json(restaurante);
    } catch (error) {
        // Mejorar manejo de errores de validación de Sequelize
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Ya existe un restaurante con el mismo teléfono o email (si fueran únicos).' });
        }
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los restaurantes
exports.getRestaurantes = async (req, res) => {
    try {
        const restaurantes = await Restaurante.findAll({
            include: { model: Usuario, as: 'propietario', attributes: ['id', 'nombre', 'email'] }
        });
        res.json(restaurantes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un restaurante por ID
exports.getRestauranteById = async (req, res) => {
    try {
        const restaurante = await Restaurante.findByPk(req.params.id, {
             include: { model: Usuario, as: 'propietario', attributes: ['id', 'nombre', 'email'] }
        });
        if (restaurante) {
            res.json(restaurante);
        } else {
            res.status(404).json({ error: 'Restaurante no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un restaurante por ID
exports.updateRestaurante = async (req, res) => {
    try {
        const restaurante = await Restaurante.findByPk(req.params.id);

        if (!restaurante) {
            return res.status(404).json({ error: 'Restaurante no encontrado' });
        }

        // Verificación de permisos: O es admin, o es el propietario del restaurante
        if (req.usuario.rol !== 'admin' && restaurante.propietarioId !== req.usuario.id) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para modificar este restaurante.' });
        }
        
        const { nombre, direccion, telefono, email, horarioApertura, horarioCierre, descripcion } = req.body;
        let updateData = { nombre, direccion, telefono, horarioApertura, horarioCierre, descripcion };

        // 1. Manejo de imagen
        if (req.file) { // Si se sube un nuevo archivo
            updateData.imageUrl = `/uploads/${req.file.filename}`;
            // Considerar borrar la imagen antigua si es necesario
        } else if (req.body.imageUrl === undefined) {
            // Si el frontend NO envió el campo imageUrl, significa que no se quiso cambiar.
            // No hacemos nada para conservar la imagen existente en DB.
        } else if (req.body.imageUrl === 'null') { // Si se envió 'null' explícitamente desde el frontend para borrar la imagen
            updateData.imageUrl = null;
        }


        // 2. Conversión de esTradicional
        updateData.esTradicional = req.body.esTradicional === 'true';

        // 3. Conversión de email de string vacío a null
        updateData.email = email || null;

        // 4. Manejo de propietarioId (solo si es admin y se proporciona)
        if (req.usuario.rol === 'admin' && req.body.propietarioId !== undefined) {
            if (req.body.propietarioId) {
                const owner = await Usuario.findByPk(req.body.propietarioId);
                if (!owner) {
                    return res.status(400).json({ error: 'El propietarioId especificado no existe.' });
                }
                updateData.propietarioId = parseInt(req.body.propietarioId);
            } else {
                updateData.propietarioId = null; // Si se envía vacío, asignarlo a null
            }
        }
        
        const [updated] = await Restaurante.update(updateData, {
            where: { id: req.params.id }
        });

        if (updated) {
            const updatedRestaurante = await Restaurante.findByPk(req.params.id);
            res.json(updatedRestaurante);
        } else {
            // Si updated es 0, significa que no se encontraron cambios o el ID no existe.
            // Aunque ya lo verificamos al principio, es una buena medida defensiva.
            res.status(400).json({ error: 'No se pudo actualizar el restaurante o no se encontraron cambios.' });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Ya existe un restaurante con el mismo teléfono o email (si fueran únicos).' });
        }
        res.status(500).json({ error: error.message || 'Error interno del servidor al actualizar el restaurante.' });
    }
};

// Eliminar un restaurante por ID
exports.deleteRestaurante = async (req, res) => {
    try {
        const restaurante = await Restaurante.findByPk(req.params.id);

        if (!restaurante) {
            return res.status(404).json({ error: 'Restaurante no encontrado' });
        }

        // Verificación de permisos: O es admin, o es el propietario del restaurante
        if (req.usuario.rol !== 'admin' && restaurante.propietarioId !== req.usuario.id) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para eliminar este restaurante.' });
        }

        const deleted = await Restaurante.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Subir imagen para un restaurante
exports.uploadRestauranteImage = async (req, res) => {
    try {
        const restauranteId = req.params.id;
        const restaurante = await Restaurante.findByPk(restauranteId);

        if (!restaurante) {
            return res.status(404).json({ error: 'Restaurante no encontrado.' });
        }

        // Verificación de permisos: O es admin, o es el propietario del restaurante
        if (req.usuario.rol !== 'admin' && restaurante.propietarioId !== req.usuario.id) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para subir imágenes para este restaurante.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo de imagen.' });
        }

        // Construir la URL de la imagen relativa a /uploads
        const imageUrl = `/uploads/${req.file.filename}`;
        restaurante.imageUrl = imageUrl;
        await restaurante.save();

        res.status(200).json({
            message: 'Imagen del restaurante subida con éxito.',
            imageUrl: imageUrl,
            restaurante: restaurante
        });

    } catch (error) {
        // Multer puede generar errores, como límite de tamaño de archivo
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'El archivo de imagen es demasiado grande. Máximo 5MB.' });
        }
        res.status(500).json({ error: error.message || 'Error interno del servidor al subir la imagen.' });
    }
};