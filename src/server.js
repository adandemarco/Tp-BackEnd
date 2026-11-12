const express = require('express');
const peritosRoutes = require('./routes/peritosRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1/peritos', peritosRoutes);


app.get('/probar-error', (req, res, next) => {
    const error = new Error("Error de prueba");
    error.status = 404;

    next(error);
});


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});