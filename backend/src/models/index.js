const sequelize = require('../../config/database');

const Usuario = require('./Usuario');
const Restaurante = require('./Restaurante');
const Plato = require('./Plato');
// const Pedido = require('./Pedido');
const Resenia = require('./Resenia');
// const DetallePedido = require('./DetallePedido');
const Canton = require('./Canton');
const Solicitud = require('./Solicitud'); // Importar nuevo modelo
const DeliveryApp = require('./DeliveryApp'); // Importar DeliveryApp
const RestauranteDeliveryApp = require('./RestauranteDeliveryApp'); // Importar el modelo de unión
const Alergia = require('./Alergia'); // Importar Alergia
const UsuarioAlergia = require('./UsuarioAlergia'); // Importar el modelo de unión UsuarioAlergia
const PlatoAlergia = require('./PlatoAlergia'); // Importar el modelo de unión PlatoAlergia

// Asociaciones
// Un usuario (propietario) puede tener muchos restaurantes
Usuario.hasMany(Restaurante, { foreignKey: 'propietarioId' });
Restaurante.belongsTo(Usuario, { as: 'propietario', foreignKey: 'propietarioId' });

// Un restaurante tiene muchos platos
Restaurante.hasMany(Plato, { foreignKey: 'restauranteId' });
Plato.belongsTo(Restaurante, { foreignKey: 'restauranteId' });

// Un usuario puede hacer muchos pedidos
// Usuario.hasMany(Pedido, { foreignKey: 'usuarioId' });
// Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Un usuario puede escribir muchas reseñas
Usuario.hasMany(Resenia, { foreignKey: 'usuarioId' });
Resenia.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Un restaurante puede tener muchas reseñas
Restaurante.hasMany(Resenia, { foreignKey: 'restauranteId' });
Resenia.belongsTo(Restaurante, { foreignKey: 'restauranteId' });

// Un restaurante pertenece a un Cantón
Restaurante.belongsTo(Canton, { foreignKey: { name: 'cantonId', allowNull: true, index: false } });
Canton.hasMany(Restaurante, { foreignKey: 'cantonId' });

// Un restaurante puede estar disponible en muchas DeliveryApps
Restaurante.belongsToMany(DeliveryApp, {
    through: RestauranteDeliveryApp,
    foreignKey: 'RestauranteId',
    otherKey: 'DeliveryAppId'
});
DeliveryApp.belongsToMany(Restaurante, {
    through: RestauranteDeliveryApp,
    foreignKey: 'DeliveryAppId',
    otherKey: 'RestauranteId'
});

// Un usuario puede tener muchas alergias (Many-to-Many)
Usuario.belongsToMany(Alergia, { through: UsuarioAlergia, foreignKey: 'UsuarioId', otherKey: 'AlergiaId' });
Alergia.belongsToMany(Usuario, { through: UsuarioAlergia, foreignKey: 'AlergiaId', otherKey: 'UsuarioId' });

// Un plato puede contener muchos alérgenos (Many-to-Many)
Plato.belongsToMany(Alergia, { through: PlatoAlergia, foreignKey: 'PlatoId', otherKey: 'AlergiaId' });
Alergia.belongsToMany(Plato, { through: PlatoAlergia, foreignKey: 'AlergiaId', otherKey: 'PlatoId' });

// Un usuario puede tener muchas solicitudes para ser propietario
Usuario.hasMany(Solicitud, { foreignKey: 'usuarioId' });
Solicitud.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Relación Muchos a Muchos entre Pedidos y Platos a través de DetallePedido
// Pedido.belongsToMany(Plato, {
//     through: DetallePedido,
//     foreignKey: 'PedidoId',
//     otherKey: 'PlatoId'
// });
// Plato.belongsToMany(Pedido, {
//     through: DetallePedido,
//     foreignKey: 'PlatoId',
//     otherKey: 'PedidoId'
// });


const db = {
    sequelize,
    Sequelize: sequelize.Sequelize,
    Usuario,
    Restaurante,
    Plato,
    // Pedido,
    Resenia,
    // DetallePedido,
    Canton,
    Solicitud, // Exportar nuevo modelo
    DeliveryApp, // Exportar DeliveryApp
    RestauranteDeliveryApp, // Exportar el modelo de unión
    Alergia, // Exportar Alergia
    UsuarioAlergia, // Exportar el modelo de unión UsuarioAlergia
    PlatoAlergia // Exportar el modelo de unión PlatoAlergia
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
