import express from 'express';
import { check, param } from 'express-validator';
import validarCampos from '../../middlewares/validarCampos.js';
import UsuariosControlador from '../../controladores/usuariosControlador.js';

const router = express.Router();
const usuariosControlador = new UsuariosControlador();

router.get('/', usuariosControlador.buscarTodos);

router.get('/:id_usuario', [
    param('id_usuario', 'El ID debe ser numérico').isInt(),
    validarCampos
], usuariosControlador.buscarPorId); 

router.post('/', [
    check('nombres', 'El nombre es obligatorio').notEmpty(),
    check('nombres', 'El nombre no debe ser mayor a 120 caracteres').isLength({ max: 120 }),

    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('apellido', 'El apellido no debe ser mayor a 120 caracteres').isLength({ max: 120 }),

    check('documento', 'El documento es obligatorio').notEmpty(),
    check('documento', 'El documento debe ser numérico').isNumeric(),

    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'Debe ingresar un email válido').isEmail(),

    check('contrasenia', 'La contraseña es obligatoria').notEmpty(),
    check('contrasenia', 'La contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 }),

    check('rol', 'El rol es obligatorio').notEmpty(),
    check('rol', 'El rol debe ser numérico').isInt(),

    check('foto', 'La foto es obligatoria').notEmpty(),

    validarCampos
], usuariosControlador.crear);

router.put('/:id_usuario', [
    param('id_usuario', 'El ID debe ser numérico').isInt(),
    check('nombres', 'El nombre es obligatorio').notEmpty(),
    check('nombres', 'El nombre no debe ser mayor a 120 caracteres').isLength({ max: 120 }),
    validarCampos
], usuariosControlador.modificar);

router.delete('/:id_usuario', [
    param('id_usuario', 'El ID debe ser numérico').isInt(),
    validarCampos
], usuariosControlador.borrar);

export { router }; 

