import express from 'express';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import TurnosControlador from '../../controladores/turnosControlador.js';
import TurnoCreateDto from '../../dtos/turnoCreateDto.js';
import validarCampos from '../../middlewares/validarCampos.js'; 

const cache = apicache.middleware;
const controller = new TurnosControlador();
const router = express.Router();

const validateId = [
    param('id_turno_reserva').notEmpty().isInt({ min: 1 }).toInt(),
    validarCampos
];

const validateQueryParams = [
    query('id_medico').optional().isInt().toInt(),
    query('id_paciente').optional().isInt().toInt(),
    query('atentido').optional().isInt({ min: 0, max: 1 }).toInt(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    validarCampos
];

const validatePayload = [
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

// --- SCHEMAS DE SWAGGER (DOCUMENTACIÓN ACTUALIZADA) ---
/**
 * @swagger
 * components:
 *   schemas:
 *     TurnoResponse:
 *       type: object
 *       properties:
 *         idTurnoReserva:
 *           type: integer
 *         idMedico:
 *           type: integer
 *         medicoNombre:
 *           type: string
 *         idPaciente:
 *           type: integer
 *         pacienteNombre:
 *           type: string
 *         idObraSocial:
 *           type: integer
 *         obraSocialNombre:
 *           type: string
 *         fechaHora:
 *           type: string
 *           format: date-time
 *         valorTotal:
 *           type: number
 *           format: float
 *         atendido:
 *           type: boolean
 *       example:
 *         idTurnoReserva: 1
 *         idMedico: 1
 *         medicoNombre: "Lopez Marcelo"
 *         idPaciente: 1
 *         pacienteNombre: "Lopez Jacinto"
 *         idObraSocial: 1
 *         obraSocialNombre: "Jerárquicos"
 *         fechaHora: "2026-04-01 17:00:00"
 *         valorTotal: 4500.00
 *         atendido: false
 */

// --- RUTAS CON .bind(controller) ---

/**
 * @swagger
 * /api/v2/turnos-reservas:
 *   get:
 *     summary: Obtiene la lista de turnos y reservas
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos
 */
router.get("/", 
    [validateQueryParams, findAllTransformarQueryParams, cache("5 minutes")], 
    controller.buscarTodas.bind(controller)
);

/**
 * @swagger
 * /api/v2/turnos-reservas/{id_turno_reserva}:
 *   get:
 *     summary: Obtiene un turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - name: id_turno_reserva
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno encontrado
 */
router.get("/:id_turno_reserva", 
    validateId, 
    controller.buscarPorId.bind(controller)
);

/**
 * @swagger
 * /api/v2/turnos-reservas:
 *   post:
 *     summary: Registra un nuevo turno (Calcula el costo y usa transacciones)
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turno'
 *     responses:
 *       201:
 *         description: Turno creado
 */
router.post("/", 
    [validatePayload, transformDTO], 
    controller.crear.bind(controller)
);

/**
 * @swagger
 * /api/v2/turnos-reservas/{id_turno_reserva}/atendido:
 *   patch:
 *     summary: Marca un turno como atendido
 *     tags: [Turnos]
 *     parameters:
 *       - name: id_turno_reserva
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno actualizado
 */
router.patch("/:id_turno_reserva/atendido", 
    validateId, 
    controller.marcarAtendido.bind(controller)
);

/**
 * @swagger
 * /api/v2/turnos-reservas/{id_turno_reserva}:
 *   delete:
 *     summary: Cancela/Elimina un turno (Soft Delete)
 *     tags: [Turnos]
 *     parameters:
 *       - name: id_turno_reserva
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno eliminado
 */
router.delete("/:id_turno_reserva", 
    validateId, 
    controller.borrar.bind(controller)
);

export { router };