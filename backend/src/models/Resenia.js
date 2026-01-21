const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Resenia = sequelize.define('Resenia', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    comentario: {
        type: DataTypes.TEXT,
    },
    // restauranteId se definirá en las asociaciones
    // usuarioId se definirá en las asociaciones
}, {
    tableName: 'Resenas',
});

module.exports = Resenia;
