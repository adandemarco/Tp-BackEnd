
const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

const peritosRoutes = require('./routes/peritos.routes');

app.use('/api/v1/peritos', peritosRoutes);

// app.get('/probar-error-500', (req, res, next) => {
//     next(new Error("Fallo de prueba del servidor"));
// });

app.use(errorHandler);

module.exports = app;