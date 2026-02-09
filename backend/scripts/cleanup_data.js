require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Usuario, Restaurante, Solicitud, sequelize } = require('../src/models');

async function cleanupData() {
    try {
        console.log('--- Database Environment Variables ---');
        console.log(`DB_HOST: ${process.env.DB_HOST}`);
        console.log(`DB_USER: ${process.env.DB_USER}`);
        console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '********' : 'NOT SET'}`); // Mask password
        console.log(`DB_NAME: ${process.env.DB_NAME}`);
        console.log('------------------------------------');

        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente.');

        // 1. Encontrar al usuario 'jhsotyn'
        const userToCleanup = await Usuario.findOne({ where: { nombre: 'Jhostyn' } });

        if (!userToCleanup) {
            console.log('Usuario "jhsotyn" no encontrado. No se realizó ninguna limpieza.');
            return;
        }

        console.log(`Realizando limpieza para el usuario: ${userToCleanup.nombre} (ID: ${userToCleanup.id})`);

        // 2. Eliminar todas las Solicitudes asociadas a este usuario
        const deletedSolicitudesCount = await Solicitud.destroy({
            where: { usuarioId: userToCleanup.id }
        });
        console.log(`Se eliminaron ${deletedSolicitudesCount} solicitudes asociadas a ${userToCleanup.nombre}.`);

        // 3. Eliminar todos los Restaurantes asociados a este usuario
        const deletedRestaurantesCount = await Restaurante.destroy({
            where: { propietarioId: userToCleanup.id }
        });
        console.log(`Se eliminaron ${deletedRestaurantesCount} restaurantes asociados a ${userToCleanup.nombre}.`);

        // 4. Restablecer el rol del usuario a 'cliente' si no lo es ya
        if (userToCleanup.rol !== 'cliente') {
            userToCleanup.rol = 'cliente';
            await userToCleanup.save();
            console.log(`El rol de ${userToCleanup.nombre} se restableció a 'cliente'.`);
        } else {
            console.log(`El rol de ${userToCleanup.nombre} ya es 'cliente'. No se realizaron cambios.`);
        }

        console.log('Proceso de limpieza completado exitosamente.');

    } catch (error) {
        console.error('Error durante la limpieza de datos:', error);
    } finally {
        await sequelize.close();
        console.log('Conexión a la base de datos cerrada.');
    }
}

cleanupData();
