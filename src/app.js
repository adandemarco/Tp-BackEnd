const express = require('express');
const app = express();

app.use(express.json());

const peritosRoutes = require('./routes/peritos.routes');

app.use('/api/v1/peritos', peritosRoutes);

module.exports = app;