const express = require('express');
const router = express.Router();

const { obtenerPeritos, obtenerPeritosPorId } = require('../controllers/peritosController');

router.get('/', obtenerPeritos);

router.get('/:id', obtenerPeritosPorId);

module.exports = router;