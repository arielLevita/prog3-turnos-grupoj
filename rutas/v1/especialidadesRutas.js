import express from 'express';
import { check, param } from 'express-validator';
import validarCampos from '../../middlewares/validarCampos.js';
import EspecialidadesControlador from '../../controladores/especialidadesControlador.js';
import EspecialidadCreateDto from '../../dtos/especialidadCreateDto.js';

const router = express.Router();
const especialidadesControlador = new EspecialidadesControlador();

const transformarDTO = (req, res, next) => {
    req.dto = new EspecialidadCreateDto(req.body);
    next();
};

router.get('/', especialidadesControlador.buscarTodas);

router.get('/:id_especialidad', [
    param('id_especialidad', 'El ID debe ser numérico').isInt(),
    validarCampos
], especialidadesControlador.buscarPorId); 

router.post('/', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre no debe ser mayor a 120 caracteres').isLength({ max: 120 }),
    validarCampos,
    transformarDTO
], especialidadesControlador.crear);

router.put('/:id_especialidad', [
    param('id_especialidad', 'El ID debe ser numérico').isInt(),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre no debe ser mayor a 120 caracteres').isLength({ max: 120 }),
    validarCampos,
    transformarDTO
], especialidadesControlador.modificar);

router.delete('/:id_especialidad', [
    param('id_especialidad', 'El ID debe ser numérico').isInt(),
    validarCampos
], especialidadesControlador.borrar);

export { router }; 

