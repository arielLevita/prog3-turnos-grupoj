import express from 'express';
import { check, param } from 'express-validator';
import validarCampos from '../../middlewares/validarCampos.js';
import MedicosControlador from '../../controladores/medicosControlador.js';

const router = express.Router();
const medicosControlador = new MedicosControlador();

router.get('/', medicosControlador.buscarTodos);

router.get('/:id_medico', [
    param('id_medico', 'El ID debe ser numérico').isInt(),
    validarCampos
], medicosControlador.buscarPorId); 

router.post('/', [

    check('id_usuario', 'El id_usuario es obligatorio').notEmpty(),
    check('id_usuario', 'El id_usuario debe ser numérico').isInt(),

    check('id_especialidad', 'La especialidad es obligatoria').notEmpty(),
    check('id_especialidad', 'La especialidad debe ser numérica').isInt(),

    check('matricula', 'La matrícula es obligatoria').notEmpty(),
    check('matricula', 'La matrícula debe ser numérica').isInt(),

    check('descripcion', 'La descripción es obligatoria').notEmpty(),

    check('valor_consulta', 'El valor de consulta es obligatorio').notEmpty(),
    check('valor_consulta', 'Debe ser decimal').isDecimal(),

    validarCampos

], medicosControlador.crear);

router.post('/:id_medico/obras-sociales', [

    param('id_medico', 'El id del médico es obligatorio').notEmpty(),

    check('obrasSociales', 'La obra social es obligatoria').notEmpty(),

    validarCampos

], medicosControlador.asociarMedicosObrasSociales );

router.put('/:id_medico', [

    param('id_medico', 'El ID debe ser numérico').isInt(),

    check('id_usuario', 'El id_usuario es obligatorio').notEmpty(),
    check('id_usuario', 'El id_usuario debe ser numérico').isInt(),

    check('id_especialidad', 'La especialidad es obligatoria').notEmpty(),
    check('id_especialidad', 'La especialidad debe ser numérica').isInt(),

    check('matricula', 'La matrícula es obligatoria').notEmpty(),
    check('matricula', 'La matrícula debe ser numérica').isInt(),

    check('descripcion', 'La descripción es obligatoria').notEmpty(),

    check('valor_consulta', 'El valor de consulta es obligatorio').notEmpty(),
    check('valor_consulta', 'Debe ser decimal').isDecimal(),

    validarCampos

], medicosControlador.modificar);

router.delete('/:id_medico', [
    param('id_medico', 'El ID debe ser numérico').isInt(),
    validarCampos
], medicosControlador.borrar);

export { router }; 

