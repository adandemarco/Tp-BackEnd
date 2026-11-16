
const express = require('express');
const router = express.Router();

const {
    crearPerito,
    darDeBajaPerito,
    obtenerPeritos,
    obtenerPeritoPorId
} = require('../controllers/peritos.controller');

router.post('/', crearPerito);

router.delete('/:id', darDeBajaPerito);

router.get('/', obtenerPeritos);

router.get('/:id', obtenerPeritoPorId);

module.exports = router;