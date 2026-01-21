const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Alergia = sequelize.define('Alergia', {
  idAlergia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'id de la alergia'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'nombre del alérgeno (ej: maní, gluten, lactosa)'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'información adicional sobre la alergia'
  }
}, {
  tableName: 'alergias',
  timestamps: true
});

module.exports = Alergia;