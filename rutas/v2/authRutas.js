import express from 'express';
import AuthController from '../../controladores/authControlador.js';

import { body } from 'express-validator';
import validarCampos from '../../middlewares/validarCampos.js';

const router = express.Router();
const authController = new AuthController();

const validateLogin = [
    body('email')
        .notEmpty().withMessage('El correo electrónico es requerido!.')
        .isEmail().withMessage('Revisar el formato del correo electrónico.'),
    body('contrasenia')
        .notEmpty().withMessage('La contraseña es requerida.'),
    validarCampos
];

router.post('/login', 
    validateLogin, 
    authController.login);

export {router};