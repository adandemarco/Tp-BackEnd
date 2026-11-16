const chalk = require("chalk");

function usuarioCreado(usuario){
    console.log(chalk.cyan("Usuario creado - ID: " + usuario.id +
    " - Username: " + usuario.username +
    " - Rol: " + usuario.role_id));
}

module.exports = { usuarioCreado };