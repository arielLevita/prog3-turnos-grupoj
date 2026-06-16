import express from 'express';
import validarCampos from '../../middlewares/validarCampos.js';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import EspecialidadesControlador from '../../controladores/especialidadesControlador.js';
import EspecialidadCreateDto from '../../dtos/especialidadCreateDto.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const cache = apicache.middleware;
const controller = new EspecialidadesControlador();

const router = express.Router();

const validarId = [
    param('id_especialidad').notEmpty().isInt({ min: 1 }).toInt(),
    validarCampos
];

const validarQueryParams = [
    query('nombre').optional().isString(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('order').optional().isIn(['nombre', 'idEspecialidad']),
    query('asc').optional().isBoolean().toBoolean(),
    validarCampos
];

const validarPayload = [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio")
                  .isLength({ max: 120 }).withMessage("Máximo 120 caracteres"),
    validarCampos
];

const buscarTodasTransformarQueryParams = (req, res, next) => {
    req.query.limit = req.query.limit ? Number(req.query.limit) : 0;
    req.query.offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const orderObj = {};
    const { nombre, order, asc } = req.query;

    if (nombre) filterObj.nombre = nombre;
    if (order) orderObj[order] = asc !== false ? "ASC" : "DESC";

    req.query.filter = filterObj;
    req.query.order = orderObj;
    next(); 
};

const transformarDTO = (req, res, next) => {
    req.dto = new EspecialidadCreateDto(req.body);
    next();
};

router.get("/", 
    [autorizarUsuarios([2, 3]), validarQueryParams, buscarTodasTransformarQueryParams, cache("5 minutes")], 
    controller.buscarTodas.bind(controller)
);

router.get("/:id_especialidad", 
    [autorizarUsuarios([3]), ...validarId], 
    controller.buscarPorId.bind(controller)
);

router.post("/", 
    [autorizarUsuarios([3]), ...validarPayload, transformarDTO], 
    controller.crear.bind(controller)
);

router.put("/:id_especialidad", 
    [autorizarUsuarios([3]), ...validarId, ...validarPayload, transformarDTO], 
    controller.modificar.bind(controller)
);

router.delete("/:id_especialidad", 
    [autorizarUsuarios([3]), ...validarId], 
    controller.borrar.bind(controller)
);

export { router }; 

