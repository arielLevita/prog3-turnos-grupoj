import express from 'express';
import { check, param } from 'express-validator';
import validarCampos from '../../middlewares/validarCampos.js';
import ReservasControlador from '../../controladores/reservasControlador.js';

const router = express.Router();
const reservasControlador = new ReservasControlador();

router.get('/turnos-paciente', reservasControlador.buscarTurnosPropiosPaciente);

router.get('/turnos-medico', reservasControlador.buscarTurnosPropiosMedicos);


router.get('/:id_turno_reserva', [

    param('id_turno_reserva', 'El ID debe ser numérico')
        .isInt(),

    validarCampos

], reservasControlador.buscarPorId);

router.post('/', [

    check('id_medico', 'El id_medico es obligatorio')
        .notEmpty(),

    check('id_medico', 'El id_medico debe ser numérico')
        .isInt(),

    check('id_paciente', 'El id_paciente es obligatorio')
        .notEmpty(),

    check('id_paciente', 'El id_paciente debe ser numérico')
        .isInt(),

    check('id_obra_social', 'La obra social es obligatoria')
        .notEmpty(),

    check('id_obra_social', 'La obra social debe ser numérica')
        .isInt(),

    check('fecha_hora', 'La fecha y hora es obligatoria')
        .notEmpty(),

    check('valor_total', 'El valor total es obligatorio')
        .notEmpty(),

    check('valor_total', 'El valor total debe ser decimal')
        .isDecimal(),

    check('atentido', 'El campo atendido es obligatorio')
        .notEmpty(),

    check('atentido', 'El campo atendido debe ser numérico')
        .isBoolean(),

    validarCampos

], reservasControlador.crear);

router.put('/:id_turno_reserva', [

    param('id_turno_reserva', 'El ID debe ser numérico')
        .isInt(),

    check('fecha_hora', 'La fecha y hora es obligatoria')
        .notEmpty(),

    check('atentido', 'El campo atendido es obligatorio')
        .notEmpty(),

    check('atentido', 'El campo atendido debe ser numérico')
        .isBoolean(),

    validarCampos

], reservasControlador.modificar);

router.put('/:id_turno_reserva/atendido', [

    param('id_turno_reserva', 'El ID debe ser numérico')
        .isInt(),

    check('atentido', 'El campo atendido es obligatorio')
        .notEmpty(),

    check('atentido', 'El campo atendido debe ser numérico')
        .isBoolean(),

    validarCampos

], reservasControlador.marcarAtendido);

router.delete('/:id_turno_reserva', [

    param('id_turno_reserva', 'El ID debe ser numérico')
        .isInt(),

    validarCampos

], reservasControlador.borrar);

export { router };