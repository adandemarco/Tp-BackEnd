
const sequelize = require('./config/database');
const { QueryTypes } = require('sequelize');

// Importamos los modelos y sus asociaciones
const { Role, User } = require('./models');

async function sincronizarBaseDatos() {
    try {
        // Comprobamos la conexión
        await sequelize.authenticate();

        console.log('Conexión establecida correctamente');

        // Creamos las tablas según los modelos
        await sequelize.sync();

        console.log('Tablas creadas correctamente');

        // Comprobamos las claves foráneas solo en SQLite
        if (sequelize.getDialect() === 'sqlite') {
            const resultado = await sequelize.query(
                'PRAGMA foreign_keys;',
                { type: QueryTypes.SELECT }
            );

            console.log(
                'Claves foráneas activadas:',
                resultado[0].foreign_keys
            );
        }

        if (sequelize.getDialect() === 'postgres') {
            console.log('Motor PostgreSQL detectado');
            console.log('Tablas sincronizadas correctamente');
        }

    } catch (error) {
        console.error('Error al sincronizar:', error);

    } finally {
        await sequelize.close();
    }
}

sincronizarBaseDatos();
