const app = require('./app');

console.log('Aplicación importada correctamente');

const PORT = 3001;

const servidor = app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

servidor.on('error', (error) => {
    console.error('Error al iniciar el servidor:', error);
});