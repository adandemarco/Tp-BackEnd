const createError = require('http-errors');
const { Role, User } = require('../models');
const { usuarioCreado } = require('../utils/logger');

// Registrar un nuevo perito
async function crearPerito(req, res, next) {
    try {
        const { username, role_id } = req.body;

        // Validar que el username no esté vacío
        if (typeof username !== 'string' || username.trim() === '') {
            throw createError(400, 'El username es obligatorio');
        }

        // Validar que el role_id sea un número entero positivo
        const idRol = Number(role_id);

        if (!Number.isInteger(idRol) || idRol <= 0) {
            throw createError(400, 'El role_id debe ser un número válido');
        }

        // Comprobar que el rol exista
        const rol = await Role.findByPk(idRol);

        if (!rol) {
            throw createError(400, 'El rol indicado no existe');
        }

        // Comprobar que el username no esté duplicado
        const usuarioExistente = await User.findOne({
            where: { username: username.trim() }
        });

        if (usuarioExistente) {
            throw createError(409, 'El username ya está registrado');
        }

        // Crear el perito
        const nuevoPerito = await User.create({
            username: username.trim(),
            role_id: idRol
        });

        usuarioCreado(nuevoPerito);

        return res.status(201).json({
            mensaje: 'Perito creado correctamente',
            perito: nuevoPerito
        });


    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return next(createError(409, 'El username ya está registrado'));
        }

        next(error);
    }
}

// Dar de baja un perito (baja lógica)
async function darDeBajaPerito(req, res, next) {
    try {
        // const { id } = req.params;
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            throw createError(400, "El ID debe ser un número entero positivo");
        }

        const perito = await User.findByPk(id);

        if (!perito) {
            throw createError(404, 'Perito no encontrado');
        }

        if (!perito.active) {
            throw createError(404, 'El perito ya se encuentra inactivo');
        }

        await perito.update({
            active: false
        });

        return res.status(200).json({
            mensaje: 'Perito dado de baja correctamente',
            perito
        });

    } catch (error) {
        next(error);
    }
}

async function obtenerPeritos(req, res, next) {
    try {
        const rol = req.query.role;

        const condiciones = {
            active: true
        };

        if (rol) {
            condiciones['$role.nombre_rol$'] = rol;
        }

        const peritos = await User.findAll({
            where: condiciones,
            include: {
                model: Role,
                as: 'role',
                attributes: ['nombre_rol'],
                required: false
            }
        });

        res.status(200).json(peritos);

    } catch (error) {
        next(error);
    }
}

async function obtenerPeritoPorId(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            throw createError(400, "El ID debe ser un número entero positivo");
        }

        const perito = await User.findOne({
            where: {
                id: id,
                active: true
            },
            include: {
                model: Role,
                as: 'role',
                attributes: ['nombre_rol'],
                required: false
            }
        });

        if (!perito) {
            throw createError(404, "Perito no encontrado");
        }

        res.status(200).json(perito);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    crearPerito,
    darDeBajaPerito,
    obtenerPeritos,
    obtenerPeritoPorId
};