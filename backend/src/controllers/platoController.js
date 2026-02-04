const { Plato, Restaurante } = require('../models');

// Crear un nuevo plato
exports.createPlato = async (req, res) => {
    try {
        const plato = await Plato.create(req.body);
        res.status(201).json(plato);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los platos
exports.getPlatos = async (req, res) => {
    try {
        // Opcional: filtrar platos por restaurante
        const { restauranteId } = req.query;
        const where = restauranteId ? { restauranteId } : {};
        
        const platos = await Plato.findAll({
            where,
            include: { model: Restaurante }
        });
        res.json(platos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un plato por ID
exports.getPlatoById = async (req, res) => {
    try {
        const plato = await Plato.findByPk(req.params.id, {
            include: { model: Restaurante }
        });
        if (plato) {
            res.json(plato);
        } else {
            res.status(404).json({ error: 'Plato no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un plato por ID
exports.updatePlato = async (req, res) => {
    try {
        const [updated] = await Plato.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedPlato = await Plato.findByPk(req.params.id);
            res.json(updatedPlato);
        } else {
            res.status(404).json({ error: 'Plato no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un plato por ID
exports.deletePlato = async (req, res) => {
    try {
        const deleted = await Plato.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Plato no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Subir imagen para un plato
exports.uploadPlatoImage = async (req, res) => {
    try {
        const platoId = req.params.id;
        const plato = await Plato.findByPk(platoId, {
            include: { model: Restaurante } // Incluir el restaurante para la verificación de propietario
        });

        if (!plato) {
            return res.status(404).json({ error: 'Plato no encontrado.' });
        }

        if (!plato.Restaurante) {
            return res.status(404).json({ error: 'Restaurante asociado al plato no encontrado.' });
        }

        // Verificación de permisos: O es admin, o es el propietario del restaurante del plato
        if (req.usuario.rol !== 'admin' && plato.Restaurante.propietarioId !== req.usuario.id) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para subir imágenes para este plato.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo de imagen.' });
        }

        // Construir la URL de la imagen relativa a /uploads
        const imagenUrl = `/uploads/${req.file.filename}`;
        plato.imagenUrl = imagenUrl;
        await plato.save();

        res.status(200).json({
            message: 'Imagen del plato subida con éxito.',
            imagenUrl: imagenUrl,
            plato: plato
        });

    } catch (error) {
        // Multer puede generar errores, como límite de tamaño de archivo
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'El archivo de imagen es demasiado grande. Máximo 5MB.' });
        }
        res.status(500).json({ error: error.message || 'Error interno del servidor al subir la imagen.' });
    }
};
