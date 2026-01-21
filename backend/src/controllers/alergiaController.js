const { Alergia } = require('../models');

// Obtener todas las alergias
exports.getAlergias = async (req, res) => {
    try {
        const alergias = await Alergia.findAll();
        res.json(alergias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva alergia
exports.createAlergia = async (req, res) => {
    try {
        const { nombre } = req.body;
        const alergia = await Alergia.create({ nombre });
        res.status(201).json(alergia);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};