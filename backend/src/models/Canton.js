const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Canton = sequelize.define('Canton', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'Cantones',
    timestamps: false // No createdAt/updatedAt en el SQL original para las tablas no mencionadas
});

module.exports = Canton;
