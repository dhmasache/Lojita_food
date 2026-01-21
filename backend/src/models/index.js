const sequelize = require('../../config/database');

const Usuario = require('./Usuario');
const Restaurante = require('./Restaurante');
const Plato = require('./Plato');
const Pedido = require('./Pedido');
const Resenia = require('./Resenia');
const DetallePedido = require('./DetallePedido');
const Canton = require('./Canton');

// Asociaciones
// Un usuario (propietario) puede tener muchos restaurantes
Usuario.hasMany(Restaurante, { foreignKey: 'propietarioId' });
Restaurante.belongsTo(Usuario, { as: 'propietario', foreignKey: 'propietarioId' });

// Un restaurante tiene muchos platos
Restaurante.hasMany(Plato, { foreignKey: 'restauranteId' });
Plato.belongsTo(Restaurante, { foreignKey: 'restauranteId' });

// Un usuario puede hacer muchos pedidos
Usuario.hasMany(Pedido, { foreignKey: 'usuarioId' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Un usuario puede escribir muchas reseñas
Usuario.hasMany(Resenia, { foreignKey: 'usuarioId' });
Resenia.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Un restaurante puede tener muchas reseñas
Restaurante.hasMany(Resenia, { foreignKey: 'restauranteId' });
Resenia.belongsTo(Restaurante, { foreignKey: 'restauranteId' });

// Relación Muchos a Muchos entre Pedidos y Platos a través de DetallePedido
Pedido.belongsToMany(Plato, {
    through: DetallePedido,
    foreignKey: 'PedidoId',
    otherKey: 'PlatoId'
});
Plato.belongsToMany(Pedido, {
    through: DetallePedido,
    foreignKey: 'PlatoId',
    otherKey: 'PedidoId'
});


const db = {
    sequelize,
    Sequelize: sequelize.Sequelize,
    Usuario,
    Restaurante,
    Plato,
    Pedido,
    Resenia,
    DetallePedido,
    Canton
};

// Sincronizar todos los modelos con la base de datos
const syncDb = async () => {
    try {
        await sequelize.sync({ alter: true }); // alter: true actualiza las tablas si hay cambios
        console.log("Todos los modelos se han sincronizado correctamente.");
    } catch (error) {
        console.error("Error al sincronizar los modelos:", error);
    }
};

module.exports = { ...db, syncDb };
