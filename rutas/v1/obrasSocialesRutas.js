import express from 'express';
import { check, param } from 'express-validator';
import validarCampos from '../../middlewares/validarCampos.js';
import ObrasSocialesControlador from '../../controladores/obrasSocialesControlador.js';

const router = express.Router();
const obrasSocialesControlador = new ObrasSocialesControlador();

router.get('/', obrasSocialesControlador.buscarTodas);

router.get('/:id_obra_social', [
    param('id_obra_social', 'El ID debe ser numérico').isInt(),
    validarCampos
], obrasSocialesControlador.buscarPorId);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre no debe ser mayor a 120 caracteres').isLength({ max: 120 }),

    check('descripcion', 'La descripcion es obligatoria').notEmpty(),
    check('descripcion', 'La descripcion no debe ser mayor a 255 caracteres').isLength({ max: 255 }),

    check('porcentaje_descuento', 'El porcentaje de descuento es obligatorio').notEmpty(),
    check('porcentaje_descuento', 'El porcentaje de descuento debe ser numérico').isNumeric(),

    check('es_particular', 'El campo es obligatorio')
        .notEmpty(),

    check('es_particular', 'Debe ser 0 o 1')
        .isIn([0, 1]),
    validarCampos
], obrasSocialesControlador.crear);

router.put('/:id_obra_social', [
    param('id_obra_social', 'El ID debe ser numérico').isInt(),

    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre no debe superar 120 caracteres')
        .isLength({ max: 120 }),

    check('descripcion', 'La descripción es obligatoria').notEmpty(),
    check('descripcion', 'La descripción no debe superar 255 caracteres')
        .isLength({ max: 255 }),

    check('porcentaje_descuento', 'El porcentaje debe ser numérico')
        .isNumeric(),

    check('es_particular', 'Debe ser 0 o 1')
        .isIn([0, 1]),

    validarCampos
], obrasSocialesControlador.modificar);

router.delete('/:id_obra_social', [
    param('id_obra_social', 'El ID debe ser numérico').isInt(),
    validarCampos
], obrasSocialesControlador.borrar);

export { router };

