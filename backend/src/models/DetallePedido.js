const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const DetallePedido = sequelize.define('DetallePedido', {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
    // PedidoId y PlatoId se definen como claves foráneas y primarias
}, {
    tableName: 'DetallePedidos',
    timestamps: false, // La tabla SQL no tiene createdAt/updatedAt
});

module.exports = DetallePedido;
