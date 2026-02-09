const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Plato = sequelize.define('Plato', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    imagenUrl: {
        type: DataTypes.STRING(255),
    },
    preparacion: {
        type: DataTypes.TEXT,
        allowNull: true, // Allow null if not all dishes have detailed preparation
    },
    // restauranteId se definirá en las asociaciones
}, {
    tableName: 'Platos',
});

module.exports = Plato;
