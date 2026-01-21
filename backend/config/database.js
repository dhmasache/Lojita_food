const { Sequelize } = require('sequelize');

// Configura los detalles de tu conexión a la base de datos aquí
const sequelize = new Sequelize('appgastronomica', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
