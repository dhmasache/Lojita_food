const { Pedido, Usuario, Plato, DetallePedido, sequelize } = require('../models');

// Crear un nuevo pedido
// El body esperado: { usuarioId: 1, platos: [{ platoId: 1, cantidad: 2 }, { platoId: 3, cantidad: 1 }] }
exports.createPedido = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { usuarioId, platos } = req.body;

        if (!usuarioId || !platos || !Array.isArray(platos) || platos.length === 0) {
            return res.status(400).json({ error: 'Datos de pedido inválidos. Se requiere usuarioId y un array de platos.' });
        }

        let total = 0;
        const platosACrear = [];

        for (const item of platos) {
            const plato = await Plato.findByPk(item.platoId, { transaction: t });
            if (!plato) {
                throw new Error(`Plato con id ${item.platoId} no encontrado.`);
            }
            total += plato.precio * item.cantidad;
            platosACrear.push({
                plato: plato,
                cantidad: item.cantidad,
                precioUnitario: plato.precio
            });
        }

        const pedido = await Pedido.create({
            usuarioId,
            total,
            estado: 'pendiente'
        }, { transaction: t });

        for (const item of platosACrear) {
            await pedido.addPlato(item.plato, {
                through: {
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario
                },
                transaction: t
            });
        }

        await t.commit();
        const resultado = await Pedido.findByPk(pedido.id, {
             include: [Usuario, Plato]
        });
        res.status(201).json(resultado);

    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};


// Obtener todos los pedidos
exports.getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                { model: Usuario },
                { model: Plato, through: { attributes: ['cantidad', 'precioUnitario'] } }
            ]
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un pedido por ID
exports.getPedidoById = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: [
                { model: Usuario },
                { model: Plato, through: { attributes: ['cantidad', 'precioUnitario'] } }
            ]
        });
        if (pedido) {
            res.json(pedido);
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar el estado de un pedido por ID
exports.updatePedido = async (req, res) => {
    try {
        const { estado } = req.body;
        const [updated] = await Pedido.update({ estado }, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedPedido = await Pedido.findByPk(req.params.id);
            res.json(updatedPedido);
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Dato de estado inválido' });
    }
};

// Eliminar un pedido por ID
exports.deletePedido = async (req, res) => {
    try {
        const deleted = await Pedido.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
