// backend/scripts/make-admin.js
const { Usuario, sequelize } = require('../src/models');

const makeUserAdmin = async (email) => {
    if (!email) {
        console.error('Por favor, proporciona un correo electrónico. Uso: node make-admin.js <correo@ejemplo.com>');
        process.exit(1);
    }

    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        const user = await Usuario.findOne({ where: { email } });

        if (!user) {
            console.error(`Usuario con correo ${email} no encontrado.`);
            process.exit(1);
        }

        user.rol = 'admin';
        await user.save();

        console.log(`El usuario ${email} ha sido actualizado a rol 'admin' con éxito.`);
        console.log('¡Ahora puedes iniciar sesión con este usuario y probar las funcionalidades de administrador!');

    } catch (error) {
        console.error('Error al intentar hacer admin al usuario:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
        console.log('Conexión a la base de datos cerrada.');
    }
};

const userEmail = process.argv[2];
makeUserAdmin(userEmail);
