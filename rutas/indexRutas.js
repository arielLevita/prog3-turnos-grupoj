import express from 'express';

import { autenticarJWT } from '../middlewares/autenticarJWT.js';
import { router as v1EspecialidadesRutas } from "./v1/especialidadesRutas.js";

import { router as v2EspecialidadesRutas } from "./v2/especialidadesRutas.js";
import { router as v2ObrasSocialesRutas } from "./v2/obrasSocialesRutas.js";
import { router as v2UsuariosRutas } from "./v2/usuariosRutas.js";
import { router as v2PacientesRutas } from "./v2/pacientesRutas.js";
import { router as v2TurnosRutas } from "./v2/turnosRutas.js";
import { router as v2MedicosRutas } from "./v2/medicosRutas.js";
import { router as v2AuthRutas } from "./v2/authRutas.js";
import { router as v2EstadisticasRutas } from "./v2/estadisticasRutas.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import { router as v2PublicRutas } from "./v2/publicRutas.js";

import { router as turnosWebRutas } from "./web/turnosWebRutas.js";
import { router as medicosWebRutas } from "./web/medicosWebRutas.js";
import { router as pacientesWebRutas } from "./web/pacientesWebRutas.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ estado: true, msg: 'API funcionando OK' });
});

router.use('/api/v1/especialidades', v1EspecialidadesRutas);

router.use('/api/v2/auth', v2AuthRutas);
router.use('/api/v2/public', v2PublicRutas);

const verificarToken = autenticarJWT;

router.use('/api/v2/especialidades', verificarToken, v2EspecialidadesRutas);
router.use('/api/v2/usuarios', verificarToken, v2UsuariosRutas);
router.use('/api/v2/medicos', verificarToken, v2MedicosRutas);
router.use('/api/v2/turnos', verificarToken, v2TurnosRutas);
router.use('/api/v2/pacientes', verificarToken, v2PacientesRutas);
router.use('/api/v2/obras-sociales', verificarToken, v2ObrasSocialesRutas);
router.use("/api/v2/estadisticas",verificarToken,autorizarUsuarios([3]),v2EstadisticasRutas,);

router.use('/web/turnos', turnosWebRutas);
router.use('/web/medicos', medicosWebRutas);
router.use('/web/pacientes', pacientesWebRutas);

export default router;