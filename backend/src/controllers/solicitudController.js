const { Solicitud, Usuario } = require('../models');

// Crear una nueva solicitud para ser propietario
exports.createSolicitud = async (req, res) => {
    try {
        const usuarioId = req.usuario.id; // ID del usuario que hace la solicitud (viene del middleware 'protect')
        const { nombreRestaurante, direccionRestaurante, telefonoRestaurante, descripcion } = req.body;

        // Opcional: Verificar si el usuario ya tiene una solicitud pendiente o ya es propietario
        if (req.usuario.rol !== 'cliente') {
            return res.status(400).json({ error: 'Solo los clientes pueden enviar solicitudes.' });
        }
        const existingSolicitud = await Solicitud.findOne({ where: { usuarioId, estado: 'pendiente' } });
        if (existingSolicitud) {
            return res.status(400).json({ error: 'Ya tienes una solicitud pendiente.' });
        }

        const solicitud = await Solicitud.create({
            usuarioId,
            nombreRestaurante,
            direccionRestaurante,
            telefonoRestaurante,
            descripcion
        });
        res.status(201).json(solicitud);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las solicitudes (Solo Admin)
exports.getSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.findAll({
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

        res.json({ mensaje: 'Solicitud aprobada. El rol del usuario ha sido actualizado a "propietario".', solicitud });

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
