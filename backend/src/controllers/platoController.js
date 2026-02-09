const { Plato, Restaurante, Alergia, PlatoAlergia } = require('../models');

// Crear un nuevo plato
exports.createPlato = async (req, res) => {
    try {
        const { nombre, descripcion, precio, restauranteId, preparacion, selectedAlergiaIds } = req.body;

        // Verificar el restaurante y su propietario para la autorización
        const restaurante = await Restaurante.findByPk(restauranteId);
        if (!restaurante) {
            return res.status(404).json({ error: 'Restaurante no encontrado.' });
        }

        // Autorización: Solo el admin o el propietario del restaurante pueden añadir platos
        if (req.usuario.rol !== 'admin' && restaurante.propietarioId !== req.usuario.id) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para añadir platos a este restaurante.' });
        }

        // Manejar imagenUrl si se sube un archivo
        let imagenUrl = null;
        if (req.file) {
            imagenUrl = `/uploads/${req.file.filename}`;
        }

        const plato = await Plato.create({
            nombre,
            descripcion,
            precio: parseFloat(precio), // Asegurarse de que el precio sea un número
            imagenUrl,
            preparacion, // Nuevo campo
            restauranteId: parseInt(restauranteId) // Asegurarse de que el ID sea un número
        });

        // Asegurarse de que selectedAlergiaIds sea un array
        const parsedAlergiaIds = Array.isArray(selectedAlergiaIds) ? selectedAlergiaIds : (selectedAlergiaIds ? [selectedAlergiaIds] : []);
        if (parsedAlergiaIds.length > 0) {
            await plato.setAlergias(parsedAlergiaIds);
        }
        res.status(201).json(plato);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los platos
exports.getPlatos = async (req, res) => {
    try {
        // Opcional: filtrar platos por restaurante
        const { restauranteId } = req.query;
        const where = restauranteId ? { restauranteId: parseInt(restauranteId) } : {}; // Convertir a int
        
        const platos = await Plato.findAll({
            where,
            include: [
                { model: Restaurante, attributes: ['id', 'nombre', 'propietarioId'] },
                { model: Alergia, attributes: ['id', 'nombre'], through: { attributes: [] } }
            ]
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
            include: [
                { model: Restaurante, attributes: ['id', 'nombre', 'propietarioId'] },
                { model: Alergia, attributes: ['id', 'nombre'], through: { attributes: [] } }
            ]
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
        const platoId = req.params.id;
        const { nombre, descripcion, precio, restauranteId, preparacion, selectedAlergiaIds } = req.body;

        const plato = await Plato.findByPk(platoId, {
            include: { model: Restaurante }
        });

        if (!plato) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }

        if (!plato.Restaurante) {
            return res.status(404).json({ error: 'Restaurante asociado al plato no encontrado.' });
        }

        // Autorización: Solo el admin o el propietario del restaurante pueden actualizar platos
        if (req.usuario.rol !== 'admin' && plato.Restaurante.propietarioId !== req.usuario.id) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para modificar este plato.' });
        }

        // Preparar datos para actualizar, incluyendo imagen si se sube una nueva
        let updateData = {
            nombre,
            descripcion,
            precio: parseFloat(precio),
            preparacion, // Nuevo campo
            restauranteId: parseInt(restauranteId)
        };

        if (req.file) { // Si se sube una nueva imagen con la actualización
            updateData.imagenUrl = `/uploads/${req.file.filename}`;
        }

        const [updated] = await Plato.update(updateData, {
            where: { id: platoId }
        });

        if (updated) {
            const updatedPlato = await Plato.findByPk(platoId);
            // Asegurarse de que selectedAlergiaIds sea un array
            const parsedAlergiaIds = Array.isArray(selectedAlergiaIds) ? selectedAlergiaIds : (selectedAlergiaIds ? [selectedAlergiaIds] : []);
            if (parsedAlergiaIds.length > 0) {
                await updatedPlato.setAlergias(parsedAlergiaIds);
            } else {
                await updatedPlato.setAlergias([]); // Clear all associations if none selected
            }
            res.json(updatedPlato);
        } else {
            res.status(404).json({ error: 'Plato no encontrado (o no se realizaron cambios)' });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un plato por ID
exports.deletePlato = async (req, res) => {
    try {
        const platoId = req.params.id;

        const plato = await Plato.findByPk(platoId, {
            include: { model: Restaurante }
        });

        if (!plato) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }

        if (!plato.Restaurante) {
            return res.status(404).json({ error: 'Restaurante asociado al plato no encontrado.' });
        }

        // Autorización: Solo el admin o el propietario del restaurante pueden eliminar platos
        if (req.usuario.rol !== 'admin' && plato.Restaurante.propietarioId !== req.usuario.id) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para eliminar este plato.' });
        }

        const deleted = await Plato.destroy({
            where: { id: platoId }
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

// Subir imagen para un plato (Esta función ya está bien, se usará para actualizaciones específicas de imagen)
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