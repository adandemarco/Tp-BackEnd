const chalk = require("chalk");

function errorHandler(err, req, res, next) {

    // const status = err.status || 500;

    let status;
    // Si el error no viene con código http, se considera un error interno del servidor (500), sino usamos el código que viene en el error
    if (!err.status){
        status = 500;
    }
    else {
        status = err.status;
    }

    let mensaje;

    if (status === 500){
        mensaje = "Error interno del servidor";
    }
    else{
        mensaje = err.message;
    }

    if (status === 400){
        console.log(chalk.yellow("Error de validación: " + err.message));
    }
    else if (status === 404){
        console.log(chalk.yellow("Recurso no encontrado: " + err.message));
    }
    else if (status === 500){
        console.error(chalk.red("Error crítico: " + (err.stack || err.message)));
    }

    res.status(status).json({mensaje: mensaje});
}

module.exports = errorHandler;