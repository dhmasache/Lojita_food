const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const UsuarioAlergia = sequelize.define('UsuarioAlergia', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UsuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios', // This is the table name
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
    tableName: 'usuario_alergias',
    timestamps: false, // No need for timestamps on a join table
});

module.exports = UsuarioAlergia;