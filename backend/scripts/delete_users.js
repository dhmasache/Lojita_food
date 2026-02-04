// Carga las variables de entorno desde .env
require('dotenv').config({ path: '../.env' });

const { Usuario, Restaurante, sequelize } = require('../src/models'); // Importar Restaurante

async function deleteUsers() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Eliminar todos los registros de la tabla Restaurantes primero (depende de Usuario)
        console.log('Eliminando todos los Restaurantes...');
        await Restaurante.destroy({ where: {} });
        console.log('Restaurantes eliminados correctamente.');

        // Eliminar todos los registros de la tabla Usuarios
        console.log('Eliminando todos los Usuarios...');
        const deletedUserCount = await Usuario.destroy({
            where: {}, // Vacío significa todos los registros
            // No usar 'truncate: true' cuando hay FK activas que lo impiden.
            // destroy({ where: {} }) emitirá DELETE en lugar de TRUNCATE.
        });

        console.log(`${deletedUserCount} usuarios eliminados correctamente de la base de datos.`);
        
    } catch (error) {
        console.error('Error al eliminar usuarios:', error);
    } finally {
        await sequelize.close();
        console.log('Conexión a la base de datos cerrada.');
    }
}

deleteUsers();
