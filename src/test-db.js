
const sequelize = require('./config/database');

async function probarConexion() {
    try {
        await sequelize.authenticate();

        console.log('Conexión con SQLite exitosa');

    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);

    } finally {
        await sequelize.close();
    }
}

probarConexion();
