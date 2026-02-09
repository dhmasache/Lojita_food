const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Corregir la importación de sequelize

const Alergia = sequelize.define('Alergia', {
  id: { // Renombrar a 'id' para consistencia
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Asegurar que los nombres de alérgenos sean únicos
  },
  // La columna 'descripcion' ya no se incluye en el modelo
}, {
  tableName: 'Alergias', // Corregir a 'Alergias' para consistencia
  timestamps: true // Mantener timestamps si son útiles para el registro de alergias
});

module.exports = Alergia;