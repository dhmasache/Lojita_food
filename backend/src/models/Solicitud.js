const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Solicitud = sequelize.define('Solicitud', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombreRestaurante: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre del restaurante no puede estar vacío.'
            }
        }
    },
    email: { // Nuevo campo para el email del restaurante
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    direccionRestaurante: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La dirección del restaurante no puede estar vacía.'
            }
        }
    },
    telefonoRestaurante: {
        type: DataTypes.STRING,
        allowNull: true, // Opcional
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true, // Opcional
    },
    imageUrl: { // Nuevo campo para la imagen del restaurante en la solicitud
        type: DataTypes.STRING,
        allowNull: true,
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
        defaultValue: 'pendiente',
        allowNull: false,
    },
    latitud: {
        type: DataTypes.DECIMAL(10, 8), // Precision para latitud
        allowNull: true,
    },
    longitud: {
        type: DataTypes.DECIMAL(11, 8), // Precision para longitud
        allowNull: true,
    },
    // La llave foránea 'usuarioId' se añadirá a través de las asociaciones
}, {
    tableName: 'Solicitudes',
    timestamps: true, // Añade createdAt y updatedAt automáticamente
});

module.exports = Solicitud;