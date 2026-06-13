import express from 'express';
import { query } from "express-validator";
import apicache from "apicache";
import MedicosServicio from '../../servicios/medicosServicio.js';
import MedicoPublicoResponseDto from '../../dtos/medicoPublicoResponseDto.js';
import EspecialidadesControlador from '../../controladores/especialidadesControlador.js';
import validarCampos from '../../middlewares/validarCampos.js';

const cache = apicache.middleware;
const router = express.Router();

const medicosServicio = new MedicosServicio();
const especialidadesController = new EspecialidadesControlador();


const validateMedicosQueryParams = [
    query('apellido').optional().isString(),
    query('nombres').optional().isString(),
    query('especialidad_nombre').optional().isString(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('order').optional().isIn(['apellido', 'matricula', 'valor_consulta']),
    query('asc').optional().isBoolean().toBoolean(),
    validarCampos
];

const medicosTransformarQueryParams = (req, res, next) => {
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

router.get("/medicos", 
    [validateMedicosQueryParams, medicosTransformarQueryParams], 
    async (req, res) => {
        try {
            const { filter, limit, offset, order } = req.query;
        
            const medicosCompletos = await medicosServicio.buscarTodas(filter, limit, offset, order);
            
            const medicosPublicos = medicosCompletos.map(m => new MedicoPublicoResponseDto(m));
            
            res.status(200).json(medicosPublicos);
        } catch (error) {
            console.error("Error en ruta pública de médicos:", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
);


const validateEspecialidadesQueryParams = [
    query('nombre').optional().isString(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('order').optional().isIn(['nombre', 'idEspecialidad']),
    query('asc').optional().isBoolean().toBoolean(),
    validarCampos
];

const especialidadesTransformarQueryParams = (req, res, next) => {
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

router.get("/especialidades", 
    [validateEspecialidadesQueryParams, especialidadesTransformarQueryParams, cache("5 minutes")], 
    especialidadesController.buscarTodas.bind(especialidadesController)
);

export { router }; 
