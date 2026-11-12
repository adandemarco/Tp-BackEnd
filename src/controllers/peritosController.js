const peritos = [
    { id: 1, username: "admin", role: "ADMIN", active: true },
    { id: 2, username: "juan", role: "FORENSIC_INSPECTOR", active: true },
    { id: 3, username: "ana", role: "AUDITOR", active: false },
    { id: 4, username: "pedro", role: "ADMIN", active: true }
];

function obtenerPeritos(req, res) {
    try{
        const rol = req.query.role;

        let peritosActivos = peritos.filter(perito => perito.active === true);

        if (rol) {
            peritosActivos = peritosActivos.filter(perito => perito.role === rol);
        }

        res.status(200).json(peritosActivos);
    } catch (error) {
        next(error);
    }
}

module.exports = { obtenerPeritos };

function obtenerPeritosPorId(req, res) {
    const id = Number(req.params.id);

    const perito = peritos.find(perito => perito.id === id && perito.active ===true);

    if (!perito){
        return res.status(400).json({mensaje: "Perito no encontrado"});
    }
    
    res.status(200).json(perito);
}

module.exports = { obtenerPeritos, obtenerPeritosPorId };