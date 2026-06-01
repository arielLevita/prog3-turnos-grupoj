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

// Validamos el JSON completo de entrada
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

// --- SCHEMAS DE SWAGGER (DOCUMENTACIÓN) ---
/**
 * @swagger
 * components:
 *   schemas:
 *     Medico:
 *       type: object
 *       required:
 *         - idUsuario
 *         - idEspecialidad
 *         - matricula
 *         - valorConsulta
 *       properties:
 *         idUsuario:
 *           type: integer
 *           description: ID del usuario asociado a este médico
 *         idEspecialidad:
 *           type: integer
 *           description: ID de la especialidad
 *         matricula:
 *           type: integer
 *         descripcion:
 *           type: string
 *         valorConsulta:
 *           type: number
 *           format: float
 *       example:
 *         idUsuario: 1
 *         idEspecialidad: 2
 *         matricula: 12345
 *         descripcion: "Atiende lunes y miércoles"
 *         valorConsulta: 12000.50
 */

// --- RUTAS CON .bind(controller) ---

/**
 * @swagger
 * /api/v2/medicos:
 *   get:
 *     summary: Obtiene la lista de médicos (con datos de usuario y especialidad)
 *     tags: [Médicos]
 *     responses:
 *       200:
 *         description: Lista de médicos
 */
router.get("/", 
    [validateQueryParams, findAllTransformarQueryParams, cache("5 minutes")], 
    controller.buscarTodas.bind(controller)
);

/**
 * @swagger
 * /api/v2/medicos/{id_medico}:
 *   get:
 *     summary: Obtiene un médico por ID
 *     tags: [Médicos]
 *     parameters:
 *       - name: id_medico
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Médico encontrado
 */
router.get("/:id_medico", 
    validateId, 
    controller.buscarPorId.bind(controller)
);

/**
 * @swagger
 * /api/v2/medicos:
 *   post:
 *     summary: Registra un nuevo médico
 *     tags: [Médicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Medico'
 *     responses:
 *       201:
 *         description: Creado con éxito
 */
router.post("/", 
    [validatePayload, transformDTO], 
    controller.crear.bind(controller)
);

// router.post('/:id_medico/obras-sociales', [

//     validatePayload, transformDTO

// ], controller.asociarMedicosObrasSociales.bind(controller) );

router.post('/:id_medico/obras-sociales', [

    param('id_medico').isInt(),

    body('obrasSociales').isArray({ min: 1 }),

    body('obrasSociales.*.id_obra_social').isInt(),

    validarCampos

], controller.asociarMedicosObrasSociales.bind(controller));

/**
 * @swagger
 * /api/v2/medicos/{id_medico}:
 *   put:
 *     summary: Actualiza datos de un médico
 *     tags: [Médicos]
 *     parameters:
 *       - name: id_medico
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Medico'
 *     responses:
 *       200:
 *         description: Modificado con éxito
 */
router.put("/:id_medico", 
    [validateId, validatePayload, transformDTO], 
    controller.modificar.bind(controller)
);

/**
 * @swagger
 * /api/v2/medicos/{id_medico}:
 *   delete:
 *     summary: Borrado lógico (Desactiva al usuario)
 *     tags: [Médicos]
 *     parameters:
 *       - name: id_medico
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado con éxito
 */
router.delete("/:id_medico", 
    validateId, 
    controller.borrar.bind(controller)
);

export { router };


