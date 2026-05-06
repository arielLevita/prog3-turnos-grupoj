import express from "express";
import testConexion from "./db/test-conexion.js";
import { router as v1EspecialidadesRutas } from "./rutas/v1/especialidadesRutas.js";
import { validateContentType } from "./middlewares/validateContentType.js";

const app = express();

await testConexion();

app.use(validateContentType);

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ estado: true, msg: 'API funcionando OK' });
});

app.use('/api/v1/especialidades', v1EspecialidadesRutas);

const PUERTO = process.env.PUERTO || 3007;

app.listen(PUERTO, () => {
    console.log(`Servidor iniciado OK en el puerto: ${PUERTO}`);
}); 
