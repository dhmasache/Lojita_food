// Carga las variables de entorno desde .env
require('dotenv').config({ path: '../.env' });

const { Usuario, sequelize } = require('../src/models');

async function makeAdmin(email) {
    if (!email) {
        console.error('Por favor, proporciona el correo electrónico del usuario a quien deseas hacer administrador.');
        console.error('Uso: node make_admin.js <correo_electronico>');
        process.exit(1);
    }

    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            console.error(`Usuario con el correo ${email} no encontrado.`);
            process.exit(1);
        }

        if (usuario.rol === 'admin') {
            console.log(`El usuario ${email} ya es administrador.`);
        } else {
            usuario.rol = 'admin';
            await usuario.save();
            console.log(`El usuario ${email} ha sido promovido a administrador correctamente.`);
        }
        
    } catch (error) {
        console.error('Error al hacer administrador al usuario:', error);
    } finally {
        await sequelize.close();
        console.log('Conexión a la base de datos cerrada.');
    }
}

// Obtener el email de los argumentos de la línea de comandos
const userEmail = process.argv[2];
makeAdmin(userEmail);
