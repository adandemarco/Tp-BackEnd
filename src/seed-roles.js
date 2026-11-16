const sequelize = require('./config/database');
const { Role } = require('./models');

async function cargarRoles() {
    try {
        await sequelize.authenticate();

        console.log('Conexión establecida correctamente');

        const roles = [
            'ADMIN',
            'FORENSIC_INSPECTOR',
            'AUDITOR'
        ];

        for (const nombre_rol of roles) {
            await Role.findOrCreate({
                where: { nombre_rol },
                defaults: { nombre_rol }
            });
        }

        console.log('Roles cargados correctamente');

        const rolesGuardados = await Role.findAll({
            order: [['id', 'ASC']]
        });

        console.table(
            rolesGuardados.map(rol => rol.toJSON())
        );

    } catch (error) {
        console.error('Error al cargar los roles:', error);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

cargarRoles();