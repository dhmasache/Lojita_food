const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Middleware para proteger rutas verificando el token
const protect = async (req, res, next) => {
    let token;

    // Leer el token del header, formato "Bearer TOKEN"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            // NOTA: El 'secret' debe ser el mismo que usaste para firmar el token y debería estar en una variable de entorno
            const decoded = jwt.verify(token, 'tu_super_secreto');

            // Obtener el usuario del token y adjuntarlo al objeto `req`
            // Excluimos el password del objeto de usuario que se adjunta
            req.usuario = await Usuario.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!req.usuario) {
                return res.status(401).json({ error: 'No autorizado, el usuario del token ya no existe.' });
            }

            next(); // Continuar al siguiente middleware
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'No autorizado, token inválido.' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'No autorizado, no se proporcionó un token.' });
    }
};

// Middleware para autorizar basado en roles
// Se usa después del middleware `protect`
const authorize = (...roles) => {
    return (req, res, next) => {
        // `req.usuario` es adjuntado por el middleware `protect`
        if (!req.usuario || !roles.includes(req.usuario.rol)) {
            return res.status(403).json({ error: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}.` });
        }
        next();
    };
};

module.exports = {
    protect,
    authorize,
};
