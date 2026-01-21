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
