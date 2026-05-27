import express from 'express';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import MedicosObrasSocialesControlador from '../../controladores/medicosObrasSocialesControlador.js';
import MedicoObraSocialCreateDto from '../../dtos/medicoObraSocialCreateDto.js';
import validarCampos from '../../middlewares/validarCampos.js'; 

const cache = apicache.middleware;
const controller = new MedicosObrasSocialesControlador();
const router = express.Router();

const validateId = [
    param('id_medico_obra_social').notEmpty().isInt({ min: 1 }).toInt(),
    validarCampos
];

const validateQueryParams = [
    query('id_medico').optional().isInt().toInt(),
    query('id_obra_social').optional().isInt().toInt(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    validarCampos
];

const validatePayload = [
    body("idMedico").notEmpty().isInt({ min: 1 }).withMessage("ID de médico obligatorio"),
    body("idObraSocial").notEmpty().isInt({ min: 1 }).withMessage("ID de obra social obligatorio"),
    validarCampos
];

const findAllTransformarQueryParams = (req, res, next) => {
    req.query.limit = req.query.limit ? Number(req.query.limit) : 0;
    req.query.offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const { id_medico, id_obra_social } = req.query;

    if (id_medico) filterObj.id_medico = id_medico;
    if (id_obra_social) filterObj.id_obra_social = id_obra_social;

    req.query.filter = filterObj;
    next();
};

const transformDTO = (req, res, next) => {
    req.dto = new MedicoObraSocialCreateDto(req.body);
    next();
};

// --- SCHEMAS DE SWAGGER (DOCUMENTACIÓN) ---
/**
 * @swagger
 * components:
 *   schemas:
 *     MedicoObraSocial:
 *       type: object
 *       required:
 *         - idMedico
 *         - idObraSocial
 *       properties:
 *         idMedico:
 *           type: integer
 *         idObraSocial:
 *           type: integer
 *       example:
 *         idMedico: 1
 *         idObraSocial: 2
 */

// --- RUTAS CON .bind(controller) ---

/**
 * @swagger
 * /api/v2/medicos-obras-sociales:
 *   get:
 *     summary: Lista las asociaciones entre médicos y obras sociales
 *     tags: [Asociaciones]
 *     responses:
 *       200:
 *         description: Lista de asociaciones
 */
router.get("/", 
    [validateQueryParams, findAllTransformarQueryParams, cache("5 minutes")], 
    controller.buscarTodas.bind(controller)
);

/**
 * @swagger
 * /api/v2/medicos-obras-sociales/{id_medico_obra_social}:
 *   get:
 *     summary: Obtiene una asociación por ID
 *     tags: [Asociaciones]
 *     parameters:
 *       - name: id_medico_obra_social
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asociación encontrada
 */
router.get("/:id_medico_obra_social", 
    validateId, 
    controller.buscarPorId.bind(controller)
);

/**
 * @swagger
 * /api/v2/medicos-obras-sociales:
 *   post:
 *     summary: Asocia un médico con una obra social
 *     tags: [Asociaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicoObraSocial'
 *     responses:
 *       201:
 *         description: Asociación creada
 */
router.post("/", 
    [validatePayload, transformDTO], 
    controller.crear.bind(controller)
);

/**
 * @swagger
 * /api/v2/medicos-obras-sociales/{id_medico_obra_social}:
 *   put:
 *     summary: Modifica una asociación
 *     tags: [Asociaciones]
 *     parameters:
 *       - name: id_medico_obra_social
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicoObraSocial'
 *     responses:
 *       200:
 *         description: Modificada con éxito
 */
router.put("/:id_medico_obra_social", 
    [validateId, validatePayload, transformDTO], 
    controller.modificar.bind(controller)
);

/**
 * @swagger
 * /api/v2/medicos-obras-sociales/{id_medico_obra_social}:
 *   delete:
 *     summary: Elimina una asociación (Soft Delete)
 *     tags: [Asociaciones]
 *     parameters:
 *       - name: id_medico_obra_social
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminada
 */
router.delete("/:id_medico_obra_social", 
    validateId, 
    controller.borrar.bind(controller)
);

export { router };