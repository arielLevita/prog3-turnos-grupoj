import express from 'express';
// Importamos check (para body) y param (para URL)
import { check, param } from 'express-validator';
import validarCampos from '../../middlewares/validarCampos.js';
import EspecialidadesControlador from '../../controladores/especialidadesControlador.js';

const router = express.Router();
// Instanciamos el controlador que usa POO
const especialidadesControlador = new EspecialidadesControlador();

router.get('/', especialidadesControlador.buscarTodas);

router.get('/:id_especialidad', [
    param('id_especialidad', 'El ID debe ser numérico').isInt(),
    validarCampos
], especialidadesControlador.buscarPorId);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    // Validamos que respete el VARCHAR(120) de la BD
    check('nombre', 'El nombre no debe ser mayor a 120 caracteres').isLength({ max: 120 }),
    validarCampos
], especialidadesControlador.crear);

router.put('/:id_especialidad', [
    param('id_especialidad', 'El ID debe ser numérico').isInt(),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre no debe ser mayor a 120 caracteres').isLength({ max: 120 }),
    validarCampos
], especialidadesControlador.modificar);

router.delete('/:id_especialidad', [
    param('id_especialidad', 'El ID debe ser numérico').isInt(),
    validarCampos
], especialidadesControlador.borrar);

export { router };