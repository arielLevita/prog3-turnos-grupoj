import express from 'express';
import { check, param } from 'express-validator';
import validarCampos from '../../middlewares/validarCampos.js';
import MedicosObrasSocialesControlador from '../../controladores/medicosObrasSocialesControlador.js';

const router = express.Router();
const medicosObrasSocialesControlador = new MedicosObrasSocialesControlador();

router.get('/', medicosObrasSocialesControlador.buscarTodos);

router.get('/:id_medico_obra_social', [
    param('id_medico_obra_social', 'El ID debe ser numérico').isInt(),
    validarCampos
], medicosObrasSocialesControlador.buscarPorId);

router.post('/', [

    check('id_medico', 'El id_medico debe ser numérico').isInt(),

    check('id_obra_social', 'El id_obra_social debe ser numérico').isInt(),

    validarCampos

], medicosObrasSocialesControlador.crear);

router.put('/:id_medico_obra_social', [

    param('id_medico_obra_social', 'El ID debe ser numérico').isInt(),

    check('id_medico', 'El id_medico debe ser numérico').isInt(),

    check('id_obra_social', 'El id_obra_social debe ser numérico').isInt(),

    validarCampos

], medicosObrasSocialesControlador.modificar);

router.delete('/:id_medico_obra_social', [
    param('id_medico_obra_social', 'El ID debe ser numérico').isInt(),
    validarCampos
], medicosObrasSocialesControlador.borrar);

export { router };

