const { Resenia, Restaurante, Usuario } = require('../models');

// Crear una nueva reseña
exports.createResenia = async (req, res) => {
    try {
        const resenia = await Resenia.create(req.body);
        res.status(201).json(resenia);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las reseñas
exports.getResenias = async (req, res) => {
    try {
        // Opcional: filtrar reseñas por restaurante o usuario
        const { restauranteId, usuarioId } = req.query;
        const where = {};
        if (restauranteId) where.restauranteId = restauranteId;
        if (usuarioId) where.usuarioId = usuarioId;

        const resenias = await Resenia.findAll({
            where,
            include: [Restaurante, Usuario]
        });
        res.json(resenias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una reseña por ID
exports.getReseniaById = async (req, res) => {
    try {
        const resenia = await Resenia.findByPk(req.params.id, {
            include: [Restaurante, Usuario]
        });
        if (resenia) {
            res.json(resenia);
        } else {
            res.status(404).json({ error: 'Reseña no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una reseña por ID
exports.updateResenia = async (req, res) => {
    try {
        const { calificacion, comentario } = req.body;
        const [updated] = await Resenia.update({ calificacion, comentario }, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedResenia = await Resenia.findByPk(req.params.id);
            res.json(updatedResenia);
        } else {
            res.status(404).json({ error: 'Reseña no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una reseña por ID
exports.deleteResenia = async (req, res) => {
    try {
        const deleted = await Resenia.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Reseña no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
