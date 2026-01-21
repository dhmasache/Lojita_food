const { Restaurante, Usuario } = require('../models');

// Crear un nuevo restaurante
exports.createRestaurante = async (req, res) => {
    try {
        const restaurante = await Restaurante.create(req.body);
        res.status(201).json(restaurante);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los restaurantes
exports.getRestaurantes = async (req, res) => {
    try {
        const restaurantes = await Restaurante.findAll({
            include: { model: Usuario, as: 'propietario' }
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
             include: { model: Usuario, as: 'propietario' }
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
        const [updated] = await Restaurante.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedRestaurante = await Restaurante.findByPk(req.params.id);
            res.json(updatedRestaurante);
        } else {
            res.status(404).json({ error: 'Restaurante no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un restaurante por ID
exports.deleteRestaurante = async (req, res) => {
    try {
        const deleted = await Restaurante.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Restaurante no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
