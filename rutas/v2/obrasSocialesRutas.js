import express from 'express';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import ObrasSocialesControlador from '../../controladores/obrasSocialesControlador.js';
import ObraSocialCreateDto from '../../dtos/obraSocialCreateDto.js';
import validarCampos from '../../middlewares/validarCampos.js'; 

const cache = apicache.middleware;
const controller = new ObrasSocialesControlador();
const router = express.Router();

// --- MIDDLEWARES LOCALES ---

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

// Validamos el JSON completo que nos mandan
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

// --- SCHEMAS DE SWAGGER (DOCUMENTACIÓN) ---
/**
 * @swagger
 * components:
 *   schemas:
 *     ObraSocial:
 *       type: object
 *       required:
 *         - nombre
 *         - descripcion
 *       properties:
 *         idObraSocial:
 *           type: integer
 *           description: ID de la obra social
 *         nombre:
 *           type: string
 *           description: Nombre de la obra social
 *         descripcion:
 *           type: string
 *           description: Descripción o detalles
 *         porcentajeDescuento:
 *           type: number
 *           format: float
 *           description: Porcentaje de descuento aplicado
 *         esParticular:
 *           type: boolean
 *           description: Indica si es atención particular
 *       example:
 *         idObraSocial: 1
 *         nombre: OSUNER
 *         descripcion: Obra Social de la Universidad
 *         porcentajeDescuento: 10.5
 *         esParticular: false
 */

// --- RUTAS CON .bind(controller) ---

/**
 * @swagger
 * /api/v2/obras-sociales:
 *   get:
 *     summary: Obtiene la lista de obras sociales
 *     tags: [Obras Sociales]
 *     responses:
 *       200:
 *         description: Lista de obras sociales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ObraSocial'
 */
router.get("/", 
    [validarQueryParams, findAllTransformarQueryParams, cache("5 minutes")], 
    controller.buscarTodas.bind(controller)
);

/**
 * @swagger
 * /api/v2/obras-sociales/{id_obra_social}:
 *   get:
 *     summary: Obtiene una obra social por ID
 *     tags: [Obras Sociales]
 *     parameters:
 *       - name: id_obra_social
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Obra social encontrada
 */
router.get("/:id_obra_social", 
    validarId, 
    controller.buscarPorId.bind(controller)
);

/**
 * @swagger
 * /api/v2/obras-sociales:
 *   post:
 *     summary: Crea una nueva obra social
 *     tags: [Obras Sociales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ObraSocial'
 *     responses:
 *       201:
 *         description: Creada con éxito
 */
router.post("/", 
    [validarPayload, transformDTO], 
    controller.crear.bind(controller)
);

/**
 * @swagger
 * /api/v2/obras-sociales/{id_obra_social}:
 *   put:
 *     summary: Actualiza una obra social
 *     tags: [Obras Sociales]
 *     parameters:
 *       - name: id_obra_social
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ObraSocial'
 *     responses:
 *       200:
 *         description: Modificada con éxito
 */
router.put("/:id_obra_social", 
    [validarId, validarPayload, transformDTO], 
    controller.modificar.bind(controller)
);

/**
 * @swagger
 * /api/v2/obras-sociales/{id_obra_social}:
 *   delete:
 *     summary: Borrado lógico de una obra social
 *     tags: [Obras Sociales]
 *     parameters:
 *       - name: id_obra_social
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminada con éxito
 */
router.delete("/:id_obra_social", 
    validarId, 
    controller.borrar.bind(controller)
);

export { router };