import express from 'express';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import MedicosControlador from '../../controladores/medicosControlador.js';
import MedicoCreateDto from '../../dtos/medicoCreateDto.js';
import validarCampos from '../../middlewares/validarCampos.js'; 

const cache = apicache.middleware;
const controller = new MedicosControlador();
const router = express.Router();

const validateId = [
    param('id_medico').notEmpty().isInt({ min: 1 }).toInt(),
    validarCampos
];

const validateQueryParams = [
    query('apellido').optional().isString(),
    query('nombres').optional().isString(),
    query('especialidad_nombre').optional().isString(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('order').optional().isIn(['apellido', 'matricula', 'valor_consulta']),
    query('asc').optional().isBoolean().toBoolean(),
    validarCampos
];

const validatePayload = [
    body("idUsuario").notEmpty().isInt({ min: 1 }).withMessage("ID de usuario obligatorio"),
    body("idEspecialidad").notEmpty().isInt({ min: 1 }).withMessage("ID de especialidad obligatorio"),
    body("matricula").notEmpty().isInt({ min: 1 }).withMessage("Matrícula obligatoria"),
    body("descripcion").optional().isString(),
    body("valorConsulta").notEmpty().isFloat({ min: 0 }).withMessage("El valor de la consulta debe ser positivo"),
    validarCampos
];

const findAllTransformarQueryParams = (req, res, next) => {
    req.query.limit = req.query.limit ? Number(req.query.limit) : 0;
    req.query.offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const orderObj = {};
    const { apellido, nombres, especialidad_nombre, order, asc } = req.query;

    if (apellido) filterObj.apellido = apellido;
    if (nombres) filterObj.nombres = nombres;
    if (especialidad_nombre) filterObj.especialidad_nombre = especialidad_nombre;
    
    if (order) orderObj[order] = asc !== false ? "ASC" : "DESC";

    req.query.filter = filterObj;
    req.query.order = orderObj;
    next();
};

const transformDTO = (req, res, next) => {
    req.dto = new MedicoCreateDto(req.body);
    next();
};

router.get("/", 
    [validateQueryParams, findAllTransformarQueryParams], 
    controller.buscarTodas.bind(controller)
);

router.get("/:id_medico", 
    validateId, 
    controller.buscarPorId.bind(controller)
);

router.post("/", 
    [validatePayload, transformDTO], 
    controller.crear.bind(controller)
);

router.post('/:id_medico/obras-sociales', [
    param('id_medico').isInt().withMessage('El ID del médico debe ser un número entero'),
    body('obras_sociales').isArray({ min: 1 }).withMessage('Debe enviar un array de obras sociales'),
    validarCampos
], controller.asociarObrasSociales.bind(controller));

router.delete('/:id_medico/obras-sociales/:id_obra_social', [
    param('id_medico').isInt().withMessage('El ID del médico debe ser un número entero'),
    param('id_obra_social').isInt().withMessage('El ID de la obra social debe ser un número entero'),
    validarCampos
], controller.desasociarObraSocial.bind(controller));

router.put("/:id_medico", 
    [validateId, validatePayload, transformDTO], 
    controller.modificar.bind(controller)
);

router.delete("/:id_medico", 
    validateId, 
    controller.borrar.bind(controller)
);

export { router };

