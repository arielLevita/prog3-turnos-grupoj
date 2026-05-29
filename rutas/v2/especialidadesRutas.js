import express from 'express';
import validarCampos from '../../middlewares/validarCampos.js';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import EspecialidadesControlador from '../../controladores/especialidadesControlador.js';
import EspecialidadCreateDto from '../../dtos/especialidadCreateDto.js';

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

// --- SCHEMAS DE SWAGGER (DOCUMENTACIÓN) ---
/**
 * @swagger
 * components:
 *   schemas:
 *     Especialidad:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         idEspecialidad:
 *           type: integer
 *           description: ID de la especialidad
 *         nombre:
 *           type: string
 *           description: Nombre de la especialidad
 *       example:
 *         idEspecialidad: 1
 *         nombre: PEDIATRÍA
 */

// --- RUTAS CON .bind(controller) ---

/**
 * @swagger
 * /api/v2/especialidades:
 *   get:
 *     summary: Obtiene la lista de especialidades (Con paginación y filtros)
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Especialidad'
 */
router.get("/", 
    [validarQueryParams, buscarTodasTransformarQueryParams, cache("5 minutes")], 
    controller.buscarTodas.bind(controller)
);

/**
 * @swagger
 * /api/v2/especialidades/{id_especialidad}:
 *   get:
 *     summary: Obtiene una especialidad por ID
 *     tags: [Especialidades]
 *     parameters:
 *       - name: id_especialidad
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Especialidad encontrada
 */
router.get("/:id_especialidad", 
    validarId, 
    controller.buscarPorId.bind(controller)
);

/**
 * @swagger
 * /api/v2/especialidades:
 *   post:
 *     summary: Crea una nueva especialidad
 *     tags: [Especialidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Especialidad'
 *     responses:
 *       201:
 *         description: Creada con éxito
 */
router.post("/", 
    [validarPayload, transformarDTO], 
    controller.crear.bind(controller)
);

/**
 * @swagger
 * /api/v2/especialidades/{id_especialidad}:
 *   put:
 *     summary: Actualiza una especialidad
 *     tags: [Especialidades]
 *     parameters:
 *       - name: id_especialidad
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Especialidad'
 *     responses:
 *       200:
 *         description: Modificada con éxito
 */
router.put("/:id_especialidad", 
    [validarId, validarPayload, transformarDTO], 
    controller.modificar.bind(controller)
);

/**
 * @swagger
 * /api/v2/especialidades/{id_especialidad}:
 *   delete:
 *     summary: Borrado lógico de una especialidad
 *     tags: [Especialidades]
 *     parameters:
 *       - name: id_especialidad
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminada con éxito
 */
router.delete("/:id_especialidad", 
    validarId, 
    controller.borrar.bind(controller)
);


export { router }; 

