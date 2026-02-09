const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const DeliveryApp = sequelize.define('DeliveryApp', {
  idApp: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'id de la aplicación de delivery'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'nombre de la aplicación de delivery (ej: Zaymi, UberEats)'
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    },
    comment: 'enlace oficial de la aplicación de delivery'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'información adicional sobre la aplicación'
  }
}, {
  tableName: 'delivery_apps',
  timestamps: true,
  indexes: [
    {
      fields: ['nombre']
    }
  ]
});

module.exports = DeliveryApp;