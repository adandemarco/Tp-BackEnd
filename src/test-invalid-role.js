const sequelize = require('./config/database');
const { User } = require('./models');

async function probarRolInexistente() {
    try {
        await User.create({
            username: 'prueba_fk_invalida',
            role_id: 99999
        });

        console.log('ERROR: Se permitió guardar un rol inexistente');

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            console.log('Prueba exitosa: la base de datos rechazó el rol inexistente');
        } else {
            console.error('Se produjo otro error:', error);
        }
    } finally {
        await sequelize.close();
    }
}

probarRolInexistente();