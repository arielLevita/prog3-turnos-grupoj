import express from "express";
import cors from "cors";
import helmet from "helmet";
import testConexion from "./db/test-conexion.js";
import fs from "fs";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./documentacion/opcionesSwagger.js";
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { validateContentType } from "./middlewares/validateContentType.js";
import indexRutas from './rutas/indexRutas.js';
import cookieParser from 'cookie-parser';
import { cargarUsuarioVista } from './middlewares/authVistas.js';
import { mensajesFlash } from './middlewares/flashMessages.js';

// (Moviendo cookieParser y cargarUsuarioVista más abajo para evitar error de app is not defined)
import passport from "passport";
import { estrategia, validacion } from "./config/passport.js";
import { router as v1EspecialidadesRutas } from './rutas/v1/especialidadesRutas.js';

const app = express();

await testConexion();

let log = fs.createWriteStream('./accesos.log', {
    flags: 'a'
});

app.use(morgan('dev'));
app.use(morgan('combined', { stream: log }));

app.use(validateContentType);
app.use(express.json());

// Después de configurar Handlebars y express.json(), agregá esto:
app.use(cookieParser());
app.use(cargarUsuarioVista);
app.use(mensajesFlash);
passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
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

// Eliminamos todo el código duplicado que había acá abajo que rompía la app

// Manejo de Error 404 (Entró a una ruta que no existe)
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Página no encontrada' });
});

// Manejo de Error 500 (Explotó algo en el código)
app.use((err, req, res, next) => {
    console.error("🔥 Error crítico:", err.stack);
    res.status(500).render('500', { title: 'Error interno' });
});

const PUERTO = process.env.PUERTO || 3007;
app.listen(PUERTO, () => {
    console.log(`Servidor iniciado OK en el puerto: ${PUERTO}`);
    console.log(`Documentación disponible en http://localhost:${PUERTO}/api-docs`);
    console.log(`Vistas disponibles en http://localhost:${PUERTO}/login`);
});