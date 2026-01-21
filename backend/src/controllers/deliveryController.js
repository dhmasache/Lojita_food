const { DeliveryApp } = require('../models');

// Obtener todas las apps de delivery
exports.getDeliveryApps = async (req, res) => {
    try {
        const deliveryApps = await DeliveryApp.findAll();
        res.json(deliveryApps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva app de delivery
exports.createDeliveryApp = async (req, res) => {
    try {
        const { nombre } = req.body;
        const deliveryApp = await DeliveryApp.create({ nombre });
        res.status(201).json(deliveryApp);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
