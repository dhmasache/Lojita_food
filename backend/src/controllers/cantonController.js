const { Canton } = require('../models');

// Crear un nuevo cantón
exports.createCanton = async (req, res) => {
    try {
        const canton = await Canton.create(req.body);
        res.status(201).json(canton);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los cantones
exports.getCantones = async (req, res) => {
    try {
        const cantones = await Canton.findAll();
        res.json(cantones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un cantón por ID
exports.getCantonById = async (req, res) => {
    try {
        const canton = await Canton.findByPk(req.params.id);
        if (canton) {
            res.json(canton);
        } else {
            res.status(404).json({ error: 'Cantón no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un cantón por ID
exports.updateCanton = async (req, res) => {
    try {
        const [updated] = await Canton.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedCanton = await Canton.findByPk(req.params.id);
            res.json(updatedCanton);
        } else {
            res.status(404).json({ error: 'Cantón no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un cantón por ID
exports.deleteCanton = async (req, res) => {
    try {
        const deleted = await Canton.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Cantón no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
