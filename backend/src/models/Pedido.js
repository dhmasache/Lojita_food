const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'en_preparacion', 'en_camino', 'entregado', 'cancelado'),
        defaultValue: 'pendiente',
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    // usuarioId se definirá en las asociaciones
}, {
    tableName: 'Pedidos',
});

module.exports = Pedido;
