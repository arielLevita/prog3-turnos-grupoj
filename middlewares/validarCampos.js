import { validationResult } from "express-validator";

const validarCampos = (req, res, next) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()){
        return res.status(400).json({
            estado: false,
            mensaje: errores.mapped()
        })
    }

    next();
}

export default validarCampos;