import express from "express";
import cors from "cors";
import helmet from "helmet";
import testConexion from "./db/test-conexion.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import fs from "fs";
import morgan from "morgan";
import { engine } from 'express-handlebars';

import { router as v1EspecialidadesRutas } from "./rutas/v1/especialidadesRutas.js";
import { router as v2EspecialidadesRutas } from "./rutas/v2/especialidadesRutas.js";
import { router as v2ObrasSocialesRutas } from "./rutas/v2/obrasSocialesRutas.js";
import { router as v2UsuariosRutas } from "./rutas/v2/usuariosRutas.js";
import { router as v2PacientesRutas } from "./rutas/v2/pacientesRutas.js";
import { router as v2TurnosRutas } from "./rutas/v2/turnosRutas.js";

import { router as v2MedicosRutas } from "./rutas/v2/medicosRutas.js";
import { validateContentType } from "./middlewares/validateContentType.js";

import { router as turnosWebRutas } from "./rutas/web/turnosWebRutas.js";
import { router as medicosWebRutas } from "./rutas/web/medicosWebRutas.js";
import { router as pacientesWebRutas } from "./rutas/web/pacientesWebRutas.js";

const app = express();

await testConexion();

let log = fs.createWriteStream('./accesos.log', { 
    flags: 'a'
});

app.use(morgan('dev'));
app.use(morgan('combined', {stream: log}));

app.use(validateContentType);
app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'], //* Acá van las urls del Front-end.
    optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));
app.use(helmet());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { 
            title: 'API Turnos Grupo J', 
            version: '1.0.0',
            description: 'Documentación interactiva de la API para el Trabajo Integrador'
        },
        servers: [{ url: `http://localhost:${process.env.PUERTO || 3007}` }],
    },
    apis: ['./rutas/v2/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.get('/', (req, res) => {
    res.status(200).json({ estado: true, msg: 'API funcionando OK' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1/especialidades', v1EspecialidadesRutas);
app.use('/api/v2/especialidades', v2EspecialidadesRutas);

app.use('/api/v2/usuarios', v2UsuariosRutas);
app.use('/api/v2/medicos', v2MedicosRutas);
app.use('/api/v2/turnos', v2TurnosRutas);
app.use('/api/v2/pacientes', v2PacientesRutas);
app.use('/api/v2/obras-sociales', v2ObrasSocialesRutas);

app.use('/web/turnos', turnosWebRutas);
app.use('/web/medicos', medicosWebRutas);
app.use('/web/pacientes', pacientesWebRutas);

const PUERTO = process.env.PUERTO || 3007;

app.listen(PUERTO, () => {
    console.log(`Servidor iniciado OK en el puerto: ${PUERTO}`);
    console.log(`Documentación disponible en http://localhost:${PUERTO}/api-docs`);
    console.log(`Vistas disponibles en http://localhost:${PUERTO}/web/turnos`); //TODO Cambiar por la vista de login
}); 
