
function errorHandler(err, req, res, next) {

    const status = err.status || 500;

    let mensaje;

    if (status === 500){
        mensaje = "Error interno del servidor";
    }
    else{
        mensaje = err.message;
    }

    res.status(status).json({mensaje: mensaje});
}

module.exports = errorHandler;