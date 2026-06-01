
import express from 'express';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import PacientesControlador from '../../controladores/pacientesControlador.js';
import PacienteCreateDto from '../../dtos/pacienteCreateDto.js';
import validarCampos from '../../middlewares/validarCampos.js'; 

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
/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       required:
 *         - idUsuario
 *         - idObraSocial
 *       properties:
 *         idUsuario:
 *           type: integer
 *           description: ID del usuario asociado a este paciente
 *         idObraSocial:
 *           type: integer
 *           description: ID de la obra social del paciente
 *       example:
 *         idUsuario: 5
 *         idObraSocial: 1
 */

/**
 * @swagger
 * /api/v2/pacientes:
 *   get:
 *     summary: Obtiene la lista de pacientes (con datos de usuario y obra social)
 *     tags: [Pacientes]
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */
router.get("/", 
    [validarQueryParams, buscarTodasTransformararQueryParams], 
    controller.buscarTodas.bind(controller)
);

/**
 * @swagger
 * /api/v2/pacientes/{id_paciente}:
 *   get:
 *     summary: Obtiene un paciente por ID
 *     tags: [Pacientes]
 *     parameters:
 *       - name: id_paciente
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paciente encontrado
 */
router.get("/:id_paciente", 
    validarId, 
    controller.buscarPorId.bind(controller)
);

/**
 * @swagger
 * /api/v2/pacientes:
 *   post:
 *     summary: Registra un nuevo paciente
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       201:
 *         description: Creado con éxito
 */
router.post("/", 
    [validarPayload, transformarDTO], 
    controller.crear.bind(controller)
);

/**
 * @swagger
 * /api/v2/pacientes/{id_paciente}:
 *   put:
 *     summary: Actualiza datos de un paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - name: id_paciente
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: Modificado con éxito
 */
router.put("/:id_paciente", 
    [validarId, validarPayload, transformarDTO], 
    controller.modificar.bind(controller)
);

/**
 * @swagger
 * /api/v2/pacientes/{id_paciente}:
 *   delete:
 *     summary: Borrado lógico (Desactiva al usuario)
 *     tags: [Pacientes]
 *     parameters:
 *       - name: id_paciente
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado con éxito
 */
router.delete("/:id_paciente", 
    validarId, 
    controller.borrar.bind(controller)
);

export { router };