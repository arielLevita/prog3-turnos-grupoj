import express from 'express';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import PacientesControlador from '../../controladores/pacientesControlador.js';
import PacienteCreateDto from '../../dtos/pacienteCreateDTO.js';
import validarCampos from '../../middlewares/validarCampos.js'; 
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const cache = apicache.middleware;
const controller = new PacientesControlador();
const router = express.Router();

const validarId = [
    param('id_paciente').notEmpty().isInt({ min: 1 }).toInt(),
    validarCampos
];

const validarQueryParams = [
    query('apellido').optional().isString(),
    query('nombres').optional().isString(),
    query('email').optional().isString(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('order').optional().isIn(['apellido', 'id_paciente', 'id_obra_social']),
    query('asc').optional().isBoolean().toBoolean(),
    validarCampos
];

const validarPayload = [
    body("idUsuario").notEmpty().isInt({ min: 1 }).withMessage("ID de usuario obligatorio"),
    body("idObraSocial").notEmpty().isInt({ min: 1 }).withMessage("ID de obra social obligatorio"),
    validarCampos
];

const buscarTodasTransformararQueryParams = (req, res, next) => {
    req.query.limit = req.query.limit ? Number(req.query.limit) : 0;
    req.query.offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const orderObj = {};
    const { apellido, nombres, email, order, asc } = req.query;

    if (apellido) filterObj.apellido = apellido;
    if (nombres) filterObj.nombres = nombres;
    if (email) filterObj.email = email;
    
    if (order) orderObj[order] = asc !== false ? "ASC" : "DESC";

    req.query.filter = filterObj;
    req.query.order = orderObj;
    next();
};

const transformarDTO = (req, res, next) => {
    req.dto = new PacienteCreateDto(req.body);
    next();
};

router.get("/", 
    [autorizarUsuarios([2, 3]), validarQueryParams, buscarTodasTransformararQueryParams], 
    controller.buscarTodas.bind(controller)
);

router.get("/:id_paciente", 
    [autorizarUsuarios([3]), ...validarId], 
    controller.buscarPorId.bind(controller)
);

router.post("/", 
    [autorizarUsuarios([3]), ...validarPayload, transformarDTO], 
    controller.crear.bind(controller)
);

router.put("/:id_paciente", 
    [autorizarUsuarios([3]), ...validarId, ...validarPayload, transformarDTO], 
    controller.modificar.bind(controller)
);

router.patch("/:id_paciente/obra-social", 
    [autorizarUsuarios([3]), ...validarId, body("idObraSocial").notEmpty().isInt({ min: 1 }).withMessage("ID de obra social obligatorio"), validarCampos], 
    controller.modificarObraSocial.bind(controller)
);

router.delete("/:id_paciente", 
    [autorizarUsuarios([3]), ...validarId], 
    controller.borrar.bind(controller)
);

export { router };