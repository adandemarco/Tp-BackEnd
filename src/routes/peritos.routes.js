const express = require('express');
const router = express.Router();

const {
    crearPerito,
    darDeBajaPerito
} = require('../controllers/peritos.controller');

router.post('/', crearPerito);

router.delete('/:id', darDeBajaPerito);

module.exports = router;