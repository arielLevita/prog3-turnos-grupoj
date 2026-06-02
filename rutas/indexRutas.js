import express from 'express';

import { router as v1EspecialidadesRutas } from "./v1/especialidadesRutas.js";

import { router as v2EspecialidadesRutas } from "./v2/especialidadesRutas.js";
import { router as v2ObrasSocialesRutas } from "./v2/obrasSocialesRutas.js";
import { router as v2UsuariosRutas } from "./v2/usuariosRutas.js";
import { router as v2PacientesRutas } from "./v2/pacientesRutas.js";
import { router as v2TurnosRutas } from "./v2/turnosRutas.js";
import { router as v2MedicosRutas } from "./v2/medicosRutas.js";

import { router as turnosWebRutas } from "./web/turnosWebRutas.js";
import { router as medicosWebRutas } from "./web/medicosWebRutas.js";
import { router as pacientesWebRutas } from "./web/pacientesWebRutas.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ estado: true, msg: 'API funcionando OK' });
});

router.use('/api/v1/especialidades', v1EspecialidadesRutas);

router.use('/api/v2/especialidades', v2EspecialidadesRutas);
router.use('/api/v2/usuarios', v2UsuariosRutas);
router.use('/api/v2/medicos', v2MedicosRutas);
router.use('/api/v2/turnos', v2TurnosRutas);
router.use('/api/v2/pacientes', v2PacientesRutas);
router.use('/api/v2/obras-sociales', v2ObrasSocialesRutas);

router.use('/web/turnos', turnosWebRutas);
router.use('/web/medicos', medicosWebRutas);
router.use('/web/pacientes', pacientesWebRutas);

export default router;