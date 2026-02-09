require('dotenv').config();

const { Sequelize } = require('sequelize');

// Configura los detalles de tu conexión a la base de datos aquí
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

module.exports = sequelize;
