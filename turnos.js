import express from "express";
import cors from "cors";
import helmet from "helmet";
import testConexion from "./db/test-conexion.js";
import fs from "fs";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./documentacion/opcionesSwagger.js";
import { engine } from 'express-handlebars';

import { validateContentType } from "./middlewares/validateContentType.js";
import indexRutas from './rutas/indexRutas.js';

import passport from "passport";
import { estrategia, validacion } from "./config/passport.js";

import { router as estadisticasRutas } from "./rutas/v2/estadisticasRutas.js";


const app = express();

await testConexion();

let log = fs.createWriteStream('./accesos.log', { 
    flags: 'a'
});

app.use(morgan('dev'));
app.use(morgan('combined', {stream: log}));

app.use(validateContentType);
app.use(express.json());

passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

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


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use('/', indexRutas);


const PUERTO = process.env.PUERTO || 3007;

app.listen(PUERTO, () => {
    console.log(`Servidor iniciado OK en el puerto: ${PUERTO}`);
    console.log(`Documentación disponible en http://localhost:${PUERTO}/api-docs`);
    console.log(`Vistas disponibles en http://localhost:${PUERTO}/web/turnos`); //TODO Cambiar por la vista de login
}); 
