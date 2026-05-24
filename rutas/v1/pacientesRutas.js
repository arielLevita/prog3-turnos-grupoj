import express from 'express';
import { check, param } from 'express-validator';
import validarCampos from '../../middlewares/validarCampos.js';
import PacientesControlador from '../../controladores/pacientesControlador.js';

const router = express.Router();
const pacientesControlador = new PacientesControlador();

router.get('/', pacientesControlador.buscarTodos);

router.get('/:id_paciente', [
    param('id_paciente', 'El ID debe ser numérico').isInt(),
    validarCampos
], pacientesControlador.buscarPorId);

router.post('/', [

    check('id_usuario', 'El id_usuario es obligatorio').notEmpty(),
    check('id_usuario', 'El id_usuario debe ser numérico').isInt(),

    check('id_obra_social', 'El id_obra_social es obligatorio').notEmpty(),
    check('id_obra_social', 'El id_obra_social debe ser numérico').isInt(),

    validarCampos

], pacientesControlador.crear);

router.put('/:id_paciente', [

    param('id_paciente', 'El ID debe ser numérico').isInt(),

    check('id_usuario', 'El id_usuario es obligatorio').notEmpty(),
    check('id_usuario', 'El id_usuario debe ser numérico').isInt(),

    check('id_obra_social', 'El id_obra_social es obligatorio').notEmpty(),
    check('id_obra_social', 'El id_obra_social debe ser numérico').isInt(),

    validarCampos

], pacientesControlador.modificar);

router.delete('/:id_paciente', [
    param('id_paciente', 'El ID debe ser numérico').isInt(),
    validarCampos
], pacientesControlador.borrar);

export { router };

