const { Restaurante, Usuario } = require('../models');

// Crear un nuevo restaurante
exports.createRestaurante = async (req, res) => {
    try {
        // Asignar el ID del usuario logueado (propietario) al restaurante
        const restauranteData = { ...req.body, propietarioId: req.usuario.id };
        const restaurante = await Restaurante.create(restauranteData);
        res.status(201).json(restaurante);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los restaurantes
exports.getRestaurantes = async (req, res) => {
    try {
        const restaurantes = await Restaurante.findAll({
            include: { model: Usuario, as: 'propietario', attributes: ['id', 'nombre', 'email'] }
        });
        res.json(restaurantes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un restaurante por ID
exports.getRestauranteById = async (req, res) => {
    try {
        const restaurante = await Restaurante.findByPk(req.params.id, {
             include: { model: Usuario, as: 'propietario', attributes: ['id', 'nombre', 'email'] }
        });
        if (restaurante) {
            res.json(restaurante);
        } else {
            res.status(404).json({ error: 'Restaurante no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un restaurante por ID
exports.updateRestaurante = async (req, res) => {
    try {
        const restaurante = await Restaurante.findByPk(req.params.id);

        if (!restaurante) {
            return res.status(404).json({ error: 'Restaurante no encontrado' });
        }

        // Verificación de permisos: O es admin, o es el propietario del restaurante
        if (req.usuario.rol !== 'admin' && restaurante.propietarioId !== req.usuario.id) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para modificar este restaurante.' });
        }
        
        const [updated] = await Restaurante.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated) {
            const updatedRestaurante = await Restaurante.findByPk(req.params.id);
            res.json(updatedRestaurante);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un restaurante por ID
exports.deleteRestaurante = async (req, res) => {
    try {
        const restaurante = await Restaurante.findByPk(req.params.id);

        if (!restaurante) {
            return res.status(404).json({ error: 'Restaurante no encontrado' });
        }

        // Verificación de permisos: O es admin, o es el propietario del restaurante
        if (req.usuario.rol !== 'admin' && restaurante.propietarioId !== req.usuario.id) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para eliminar este restaurante.' });
        }

        const deleted = await Restaurante.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
