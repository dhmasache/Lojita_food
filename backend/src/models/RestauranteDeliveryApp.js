const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const RestauranteDeliveryApp = sequelize.define('RestauranteDeliveryApp', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    RestauranteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Restaurantes', // This is the table name
            key: 'id',
        }
    },
    DeliveryAppId: { // This should match the foreign key name Sequelize generates for DeliveryApp
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'delivery_apps', // This is the table name
            key: 'idApp', // Correct primary key of DeliveryApp
        }
    },
}, {
    tableName: 'restaurante_delivery_apps',
    timestamps: false, // No need for timestamps on a join table
});

module.exports = RestauranteDeliveryApp;