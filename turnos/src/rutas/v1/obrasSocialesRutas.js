import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import ObrasSocialesControlador from '../../controladores/obrasSocialesControlador.js';

const router = express.Router();
const obrasSocialesControlador = new ObrasSocialesControlador();

// Reutilizamos el array mágico de validaciones para no escribir de más
const validacionesObraSocial = [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre no debe ser mayor a 120 caracteres').isLength({ max: 120 }),
    check('descripcion', 'La descripción es obligatoria').notEmpty(),
    check('descripcion', 'La descripción no debe superar los 255 caracteres').isLength({ max: 255 }),
    check('porcentaje_descuento', 'El descuento debe ser un número entre 0 y 100').isFloat({ min: 0, max: 100 }),
    check('es_particular', 'El campo es_particular debe ser 0 o 1').isIn([0, 1]).toInt(),
    validarCampos
];

router.get('/', obrasSocialesControlador.buscarTodas);

router.get('/:id_obra_social', [
    param('id_obra_social', 'El ID debe ser numérico').isInt(),
    validarCampos
], obrasSocialesControlador.buscarPorId);

// POST con las validaciones completas
router.post('/', validacionesObraSocial, obrasSocialesControlador.crear);

// PUT: Desempaquetamos (...) las validaciones del body y sumamos la del param (ID)
router.put('/:id_obra_social', [
    param('id_obra_social', 'El ID debe ser numérico').isInt(),
    ...validacionesObraSocial 
], obrasSocialesControlador.modificar);

router.delete('/:id_obra_social', [
    param('id_obra_social', 'El ID debe ser numérico').isInt(),
    validarCampos
], obrasSocialesControlador.borrar);

export { router };