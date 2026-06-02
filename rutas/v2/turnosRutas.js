import express from 'express';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import TurnosControlador from '../../controladores/turnosControlador.js';
import TurnoCreateDto from '../../dtos/turnoCreateDto.js';
import validarCampos from '../../middlewares/validarCampos.js'; 

const cache = apicache.middleware;
const controller = new TurnosControlador();
const router = express.Router();

const validarId = [
    param('id_turno').notEmpty().isInt({ min: 1 }).toInt(),
    validarCampos
];

const validarQueryParams = [
    query('id_medico').optional().isInt().toInt(),
    query('id_paciente').optional().isInt().toInt(),
    query('atentido').optional().isInt({ min: 0, max: 1 }).toInt(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    validarCampos
];

const validarPayload = [
    body("idMedico").notEmpty().isInt({ min: 1 }).withMessage("ID de médico obligatorio"),
    body("idPaciente").notEmpty().isInt({ min: 1 }).withMessage("ID de paciente obligatorio"),
    body("idObraSocial").notEmpty().isInt({ min: 1 }).withMessage("ID de obra social obligatorio"),
    body("fechaHora").notEmpty().isString().withMessage("Debe tener formato YYYY-MM-DD HH:MM:SS"),
    validarCampos
];

const findAllTransformarQueryParams = (req, res, next) => {
    req.query.limit = req.query.limit ? Number(req.query.limit) : 0;
    req.query.offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const { id_medico, id_paciente, atentido } = req.query;

    if (id_medico) filterObj.id_medico = id_medico;
    if (id_paciente) filterObj.id_paciente = id_paciente;
    if (atentido !== undefined) filterObj.atentido = atentido;

    req.query.filter = filterObj;
    next();
};

const transformDTO = (req, res, next) => {
    req.dto = new TurnoCreateDto(req.body);
    next();
};

router.get("/", 
    [validarQueryParams, findAllTransformarQueryParams], 
    controller.buscarTodas.bind(controller)
);

router.get("/:id_turno", 
    validarId, 
    controller.buscarPorId.bind(controller)
);

router.post("/", 
    [validarPayload, transformDTO], 
    controller.crear.bind(controller)
);

router.patch("/:id_turno/atendido", 
    validarId, 
    controller.marcarAtendido.bind(controller)
);

router.delete("/:id_turno", 
    validarId, 
    controller.borrar.bind(controller)
);

export { router };
