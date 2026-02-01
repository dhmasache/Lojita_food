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
    estado: {
        type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
        defaultValue: 'pendiente',
        allowNull: false,
    },
    // La llave foránea 'usuarioId' se añadirá a través de las asociaciones
}, {
    tableName: 'Solicitudes',
    timestamps: true, // Añade createdAt y updatedAt automáticamente
});

module.exports = Solicitud;
