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
        type: DataTypes.STRING(20), // Aumentar la longitud para aceptar números más largos
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    descripcion: {
        type: DataTypes.TEXT, // Campo para la descripción del restaurante
        allowNull: true,
    },
    estadoAprobacion: { // Nuevo campo para el estado de aprobación
        type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
        defaultValue: 'pendiente',
        allowNull: false,
    },
    latitud: {
        type: DataTypes.DECIMAL(10, 8), // Precision para latitud (ej. 123.45678901)
        allowNull: true, // Permitir nulo inicialmente si no todos los restaurantes tendrán ubicación GPS
    },
    longitud: {
        type: DataTypes.DECIMAL(11, 8), // Precision para longitud (ej. 123.45678901)
        allowNull: true, // Permitir nulo inicialmente si no todos los restaurantes tendrán ubicación GPS
    },
    // propietarioId se definirá en las asociaciones
}, {
    tableName: 'Restaurantes',
});

module.exports = Restaurante;
