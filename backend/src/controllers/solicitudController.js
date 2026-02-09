const { Solicitud, Usuario, Restaurante } = require('../models');
const { Op } = require('sequelize');

// Crear una nueva solicitud para ser propietario
exports.createSolicitud = async (req, res) => {
    try {
        const usuarioId = req.usuario.id; // ID del usuario que hace la solicitud (viene del middleware 'protect')
        const { nombreRestaurante, direccionRestaurante, telefonoRestaurante, descripcion, latitud, longitud, email } = req.body;

        // Verificar si el usuario ya tiene una solicitud pendiente o ya es propietario
        if (req.usuario.rol !== 'cliente') {
            return res.status(400).json({ error: 'Solo los clientes pueden enviar solicitudes.' });
        }
        const existingSolicitud = await Solicitud.findOne({ where: { usuarioId, estado: 'pendiente' } });
        if (existingSolicitud) {
            return res.status(400).json({ error: 'Ya tienes una solicitud pendiente.' });
        }

        // Manejar imageUrl si se sube un archivo
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const solicitud = await Solicitud.create({
            usuarioId,
            nombreRestaurante,
            email: email || null, // Guardar email
            direccionRestaurante,
            telefonoRestaurante,
            descripcion,
            latitud: latitud || null,
            longitud: longitud || null,
            imageUrl, // Guardar imageUrl
        });
        res.status(201).json(solicitud);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las solicitudes
exports.getSolicitudes = async (req, res) => {
    try {
        let whereClause = {};

        // Lógica de autorización y filtrado
        if (req.usuario.rol === 'admin') {
            // Si es admin, puede ver todas las solicitudes o filtrar por usuarioId si se proporciona
            if (req.query.usuarioId) {
                whereClause.usuarioId = req.query.usuarioId;
            }
        } else if (req.usuario.rol === 'cliente') {
            // Si es cliente, solo puede ver sus propias solicitudes
            whereClause.usuarioId = req.usuario.id;
        } else {
            // Otros roles no deberían tener acceso a esta ruta
            return res.status(403).json({ error: 'Acceso denegado. Rol no autorizado para ver solicitudes.' });
        }

        const solicitudes = await Solicitud.findAll({
            where: whereClause, // Aplicar el filtro aquí
            include: { // Incluir información del usuario que hizo la solicitud
                model: Usuario,
                attributes: ['id', 'nombre', 'email']
            },
            order: [['createdAt', 'DESC']] // Mostrar las más recientes primero
        });
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Aprobar una solicitud (Solo Admin)
exports.approveSolicitud = async (req, res) => {
    try {
        const solicitud = await Solicitud.findByPk(req.params.id);
        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada.' });
        }
        if (solicitud.estado !== 'pendiente') {
            return res.status(400).json({ error: `La solicitud ya ha sido ${solicitud.estado}.` });
        }

        const usuario = await Usuario.findByPk(solicitud.usuarioId);
        if (!usuario) {
            return res.status(404).json({ error: 'El usuario asociado a esta solicitud ya no existe.' });
        }

        // Actualizar rol del usuario y estado de la solicitud
        usuario.rol = 'propietario';
        solicitud.estado = 'aprobada';

        await usuario.save();
        await solicitud.save();

        // *** Crear el Restaurante asociado a esta solicitud ***
        const restaurante = await Restaurante.create({
            nombre: solicitud.nombreRestaurante,
            direccion: solicitud.direccionRestaurante,
            telefono: solicitud.telefonoRestaurante,
            descripcion: solicitud.descripcion,
            latitud: solicitud.latitud,
            longitud: solicitud.longitud,
            imageUrl: solicitud.imageUrl, // Pasar imageUrl de la solicitud al restaurante
            email: solicitud.email, // Pasar email de la solicitud al restaurante
            propietarioId: usuario.id,
            horarioApertura: '09:00', // Valor por defecto
            horarioCierre: '22:00',   // Valor por defecto
            estadoAprobacion: 'aprobado' // Ya está aprobado por el admin
        });

        res.json({ 
            mensaje: 'Solicitud aprobada. El rol del usuario ha sido actualizado a "propietario" y el restaurante ha sido creado.', 
            solicitud,
            restaurante 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Rechazar una solicitud (Solo Admin)
exports.rejectSolicitud = async (req, res) => {
    try {
        const solicitud = await Solicitud.findByPk(req.params.id);
        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada.' });
        }
        if (solicitud.estado !== 'pendiente') {
            return res.status(400).json({ error: `La solicitud ya ha sido ${solicitud.estado}.` });
        }

        solicitud.estado = 'rechazada';
        await solicitud.save();

        res.json({ mensaje: 'La solicitud ha sido rechazada.', solicitud });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};