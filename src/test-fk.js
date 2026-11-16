const sequelize = require('./config/database');

async function probarClaveForanea() {
    try {
        const { QueryTypes } = require('sequelize');

        const resultado = await sequelize.query(
            'PRAGMA foreign_key_list(users);',
            { type: QueryTypes.SELECT }
        );

        console.log('Relaciones de la tabla users:');
        console.table(resultado);

        if (resultado.length > 0) {
            console.log('La clave foránea está creada correctamente');
        } else {
            console.log('No se encontró ninguna clave foránea');
        }

    } catch (error) {
        console.error('Error al comprobar la clave foránea:', error);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

probarClaveForanea();