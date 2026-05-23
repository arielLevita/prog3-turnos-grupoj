import express from "express";
import testConexion from "./db/test-conexion.js";
import { router as v1EspecialidadesRutas } from "./rutas/v1/especialidadesRutas.js";
import { router as v1UsuariosRutas } from "./rutas/v1/usuariosRutas.js";
import { router as v1MedicosRutas } from "./rutas/v1/medicosRutas.js";
import { router as v1ReservasRutas } from "./rutas/v1/reservasRutas.js";
// import { router as v1PacientesRutas } from "./rutas/v1/pacientesRutas.js";
import { validateContentType } from "./middlewares/validateContentType.js";

const app = express();

await testConexion();

app.use(validateContentType);

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ estado: true, msg: 'API funcionando OK' });
});

app.use('/api/v1/especialidades', v1EspecialidadesRutas);
app.use('/api/v1/usuarios', v1UsuariosRutas);
app.use('/api/v1/medicos', v1MedicosRutas);
app.use('/api/v1/reservas', v1ReservasRutas);
// app.use('/api/v1/pacientes', v1PacientesRutas);


const PUERTO = process.env.PUERTO || 3007;

app.listen(PUERTO, () => {
    console.log(`Servidor iniciado OK en el puerto: ${PUERTO}`);
}); 
