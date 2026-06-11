import express from 'express';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import UsuarioCreateDto from '../../dtos/usuarioCreateDto.js';
import validarCampos from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const cache = apicache.middleware;
const controller = new UsuariosControlador();
const router = express.Router();

const validarId = [
    param('id_usuario').notEmpty().isInt({ min: 1 }).toInt(),
    validarCampos
];

const validarQueryParams = [
    query('documento').optional().isString(),
    query('apellido').optional().isString(),
    query('nombres').optional().isString(),
    query('email').optional().isString(),
    query('rol').optional().isInt({ min: 1, max: 3 }).toInt(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('order').optional().isIn(['apellido', 'documento', 'id_usuario']),
    query('asc').optional().isBoolean().toBoolean(),
    validarCampos
];

const validarPayload = [
    body("documento").notEmpty().withMessage("El documento es obligatorio").isLength({ max: 20 }),
    body("apellido").notEmpty().withMessage("El apellido es obligatorio").isLength({ max: 100 }),
    body("nombres").notEmpty().withMessage("El nombre es obligatorio").isLength({ max: 100 }),
    body("email").notEmpty().isEmail().withMessage("Debe ser un email válido").isLength({ max: 255 }),

    body("contrasenia").optional().isString().isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
    body("rol").optional().isInt({ min: 1, max: 3 }).withMessage("El rol debe ser 1 (Médico), 2 (Paciente) o 3 (Admin)"),
    validarCampos
];

const findAllTransformarQueryParams = (req, res, next) => {
    req.query.limit = req.query.limit ? Number(req.query.limit) : 0;
    req.query.offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const orderObj = {};
    const { documento, apellido, nombres, email, rol, order, asc } = req.query;

    if (documento) filterObj.documento = documento;
    if (apellido) filterObj.apellido = apellido;
    if (nombres) filterObj.nombres = nombres;
    if (email) filterObj.email = email;
    if (rol !== undefined) filterObj.rol = rol;

    if (order) orderObj[order] = asc !== false ? "ASC" : "DESC";

    req.query.filter = filterObj;
    req.query.order = orderObj;
    next();
};

const transformDTO = (req, res, next) => {
    req.dto = new UsuarioCreateDto(req.body);
    next();
};

router.get("/", 
    [autorizarUsuarios([3]), validarQueryParams, findAllTransformarQueryParams], 
    controller.buscarTodas.bind(controller)
);

router.get("/:id_usuario", 
    [autorizarUsuarios([3]), ...validarId], 
    controller.buscarPorId.bind(controller)
);

router.post("/", 
    [autorizarUsuarios([3]), ...validarPayload, transformDTO], 
    controller.crear.bind(controller)
);

router.put("/:id_usuario", 
    [autorizarUsuarios([3]), ...validarId, ...validarPayload, transformDTO], 
    controller.modificar.bind(controller)
);

router.delete("/:id_usuario", 
    [autorizarUsuarios([3]), ...validarId], 
    controller.borrar.bind(controller)
);

export { router };