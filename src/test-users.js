
const sequelize = require('./config/database');
const { User } = require('./models');

async function consultarUsuarios() {
    try {
        await sequelize.authenticate();

        const usuarios = await User.findAll({
            order: [['id', 'ASC']]
        });

        console.log('Usuarios registrados en SQLite:');

        console.table(
            usuarios.map(usuario => usuario.toJSON())
        );

        console.log('Cantidad de usuarios:', usuarios.length);

    } catch (error) {
        console.error('Error al consultar usuarios:', error);
    } finally {
        await sequelize.close();
    }
}

consultarUsuarios();
