import express from 'express';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import ObrasSocialesControlador from '../../controladores/obrasSocialesControlador.js';
import ObraSocialCreateDto from '../../dtos/obraSocialCreateDto.js';
import validarCampos from '../../middlewares/validarCampos.js'; 

const cache = apicache.middleware;
const controller = new ObrasSocialesControlador();
const router = express.Router();


const validarId = [
    param('id_obra_social').notEmpty().isInt({ min: 1 }).toInt(),
    validarCampos
];

const validarQueryParams = [
    query('nombre').optional().isString(),
    query('descripcion').optional().isString(),
    query('es_particular').optional().isInt({ min: 0, max: 1 }).toInt(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('order').optional().isIn(['nombre', 'idObraSocial', 'porcentajeDescuento']),
    query('asc').optional().isBoolean().toBoolean(),
    validarCampos
];

const validarPayload = [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio").isLength({ max: 120 }),
    body("descripcion").notEmpty().withMessage("La descripción es obligatoria").isLength({ max: 255 }),
    body("porcentajeDescuento").optional().isFloat({ min: 0, max: 100 }).withMessage("Debe ser un número entre 0 y 100"),
    body("esParticular").optional().isBoolean().withMessage("Debe ser true o false"),
    validarCampos
];

const findAllTransformarQueryParams = (req, res, next) => {
    req.query.limit = req.query.limit ? Number(req.query.limit) : 0;
    req.query.offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const orderObj = {};
    const { nombre, descripcion, es_particular, order, asc } = req.query;

    if (nombre) filterObj.nombre = nombre;
    if (descripcion) filterObj.descripcion = descripcion;
    if (es_particular !== undefined) filterObj.es_particular = es_particular;
    
    if (order) orderObj[order] = asc !== false ? "ASC" : "DESC";

    req.query.filter = filterObj;
    req.query.order = orderObj;
    next();
};

const transformDTO = (req, res, next) => {
    req.dto = new ObraSocialCreateDto(req.body);
    next();
};

router.get("/", 
    [validarQueryParams, findAllTransformarQueryParams, cache("5 minutes")], 
    controller.buscarTodas.bind(controller)
);

router.get("/:id_obra_social", 
    validarId, 
    controller.buscarPorId.bind(controller)
);

router.post("/", 
    [validarPayload, transformDTO], 
    controller.crear.bind(controller)
);

router.put("/:id_obra_social", 
    [validarId, validarPayload, transformDTO], 
    controller.modificar.bind(controller)
);

router.delete("/:id_obra_social", 
    validarId, 
    controller.borrar.bind(controller)
);

export { router };