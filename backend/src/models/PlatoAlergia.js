const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PlatoAlergia = sequelize.define('PlatoAlergia', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    PlatoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Platos', // This is the table name
            key: 'id',
        }
    },
    AlergiaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Alergias', // This is the table name
            key: 'id',
        }
    },
}, {
    tableName: 'plato_alergias',
    timestamps: false, // No need for timestamps on a join table
});

module.exports = PlatoAlergia;