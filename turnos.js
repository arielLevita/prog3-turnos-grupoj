import express from "express";
import cors from "cors";
import helmet from "helmet";
import testConexion from "./db/test-conexion.js";
import { router as v1EspecialidadesRutas } from "./rutas/v1/especialidadesRutas.js";
import { validateContentType } from "./middlewares/validateContentType.js";

const app = express();

await testConexion();

app.use(validateContentType);
app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'], //* Acá van las urls del Front-end.
    optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));
app.use(helmet());

app.get('/', (req, res) => {
    res.status(200).json({ estado: true, msg: 'API funcionando OK' });
});

app.use('/api/v1/especialidades', v1EspecialidadesRutas);

const PUERTO = process.env.PUERTO || 3007;

app.listen(PUERTO, () => {
    console.log(`Servidor iniciado OK en el puerto: ${PUERTO}`);
}); 
