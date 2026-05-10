// Este guardia verifica que nadie intente inyectar formatos raros (como XML o texto plano)
const validateContentType = (req, res, next) => {
    // Si la petición es para crear (POST) o modificar (PUT/PATCH)...
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        // ...revisamos que la etiqueta 'content-type' diga 'application/json'
        if (req.headers['content-type'] !== 'application/json') {
            // Código 415 significa "Formato Multimedia No Soportado"
            return res.status(415).json({ 
                estado: false, 
                msg: 'Content-Type debe ser application/json' 
            });
        }
    }
    // Si todo está bien, dejamos que el viaje continúe
    next();
};

export default validateContentType;