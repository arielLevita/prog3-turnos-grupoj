import { validationResult } from "express-validator";

const validarCampos = (req, res, next) => {
    // Recolectamos todos los errores que encontró express-validator en las rutas
    const errores = validationResult(req);

    // Si hay algún error...
    if (!errores.isEmpty()) {
        // Frenamos acá y devolvemos 400 (Bad Request / Petición Mal Formada)
        return res.status(400).json({
            estado: false,
            mensaje: errores.mapped() // .mapped() organiza los errores por nombre de campo
        });
    }

    // Si no hay errores, sigue al controlador
    next();
};

export default validarCampos;