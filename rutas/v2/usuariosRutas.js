import express from 'express';
import { query, param, body } from "express-validator";
import apicache from "apicache";
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import UsuarioCreateDto from '../../dtos/usuarioCreateDto.js';
import validarCampos from '../../middlewares/validarCampos.js'; 

const cache = apicache.middleware;
const controller = new UsuariosControlador();
const router = express.Router();

const validarId = [
    param('id_usuario').notEmpty().isInt({ min: 1 }).toInt(),
    validarCampos
];

const validarQueryParams = [
    query('documento').optional().isString(),
    query('apellido').optional().isString(),
    query('nombres').optional().isString(),
    query('email').optional().isString(),
    query('rol').optional().isInt({ min: 1, max: 3 }).toInt(),
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('order').optional().isIn(['apellido', 'documento', 'id_usuario']),
    query('asc').optional().isBoolean().toBoolean(),
    validarCampos
];

// Validamos lo que entra al crear o modificar
const validarPayload = [
    body("documento").notEmpty().withMessage("El documento es obligatorio").isLength({ max: 20 }),
    body("apellido").notEmpty().withMessage("El apellido es obligatorio").isLength({ max: 100 }),
    body("nombres").notEmpty().withMessage("El nombre es obligatorio").isLength({ max: 100 }),
    body("email").notEmpty().isEmail().withMessage("Debe ser un email válido").isLength({ max: 255 }),
    // La contraseña es opcional al modificar, pero obligatoria al crear (lo maneja la DB/DTO)
    body("contrasenia").optional().isString().isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
    body("rol").optional().isInt({ min: 1, max: 3 }).withMessage("El rol debe ser 1 (Médico), 2 (Paciente) o 3 (Admin)"),
    validarCampos
];

const findAllTransformarQueryParams = (req, res, next) => {
    req.query.limit = req.query.limit ? Number(req.query.limit) : 0;
    req.query.offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const orderObj = {};
    const { documento, apellido, nombres, email, rol, order, asc } = req.query;

    if (documento) filterObj.documento = documento;
    if (apellido) filterObj.apellido = apellido;
    if (nombres) filterObj.nombres = nombres;
    if (email) filterObj.email = email;
    if (rol !== undefined) filterObj.rol = rol;
    
    if (order) orderObj[order] = asc !== false ? "ASC" : "DESC";

    req.query.filter = filterObj;
    req.query.order = orderObj;
    next();
};

const transformDTO = (req, res, next) => {
    req.dto = new UsuarioCreateDto(req.body);
    next();
};

// --- SCHEMAS DE SWAGGER (DOCUMENTACIÓN) ---
/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - documento
 *         - apellido
 *         - nombres
 *         - email
 *         - contrasenia
 *       properties:
 *         idUsuario:
 *           type: integer
 *           description: ID autogenerado del usuario
 *         documento:
 *           type: string
 *         apellido:
 *           type: string
 *         nombres:
 *           type: string
 *         email:
 *           type: string
 *         contrasenia:
 *           type: string
 *           description: La contraseña se enviará en texto plano y se hasheará en el servidor.
 *         fotoPath:
 *           type: string
 *         rol:
 *           type: integer
 *           description: 1=Médico, 2=Paciente, 3=Admin
 *       example:
 *         documento: "45000123"
 *         apellido: "Perez"
 *         nombres: "Juan"
 *         email: "juanperez@correo.com"
 *         contrasenia: "mipassword123"
 *         rol: 2
 */

// --- RUTAS CON .bind(controller) ---

/**
 * @swagger
 * /api/v2/usuarios:
 *   get:
 *     summary: Obtiene la lista de usuarios (Censura contraseñas)
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", 
    [validarQueryParams, findAllTransformarQueryParams, cache("5 minutes")], 
    controller.buscarTodas.bind(controller)
);

/**
 * @swagger
 * /api/v2/usuarios/{id_usuario}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id_usuario
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
router.get("/:id_usuario", 
    validarId, 
    controller.buscarPorId.bind(controller)
);

/**
 * @swagger
 * /api/v2/usuarios:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Creado con éxito
 */
router.post("/", 
    [validarPayload, transformDTO], 
    controller.crear.bind(controller)
);

/**
 * @swagger
 * /api/v2/usuarios/{id_usuario}:
 *   put:
 *     summary: Actualiza datos de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id_usuario
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Modificado con éxito
 */
router.put("/:id_usuario", 
    [validarId, validarPayload, transformDTO], 
    controller.modificar.bind(controller)
);

/**
 * @swagger
 * /api/v2/usuarios/{id_usuario}:
 *   delete:
 *     summary: Borrado lógico de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id_usuario
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado con éxito
 */
router.delete("/:id_usuario", 
    validarId, 
    controller.borrar.bind(controller)
);

export { router };