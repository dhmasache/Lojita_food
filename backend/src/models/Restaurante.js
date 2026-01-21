const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Restaurante = sequelize.define('Restaurante', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    horarioApertura: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    horarioCierre: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    calificacionPromedio: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
    },
    esTradicional: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // propietarioId se definirá en las asociaciones
}, {
    tableName: 'Restaurantes',
});

module.exports = Restaurante;
