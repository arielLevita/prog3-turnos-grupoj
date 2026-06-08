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

// Después de configurar Handlebars y express.json(), agregá esto:
app.use(cookieParser());

// Habilitamos el middleware global SOLO para las rutas de las vistas
// (Asumiendo que tus vistas empiezan con la barra / o están en un archivo de rutas aparte)
app.use(cargarUsuarioVista);
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

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Archivos estáticos (CSS)
app.use(express.static(join(__dirname, "public")));

await testConexion();

app.use(validateContentType);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta GET - mostrar formulario de login
app.get("/login", (req, res) => {
    res.render("login");
});

// Ruta POST - procesar login
app.post("/login", async (req, res) => {
    const { email, contrasenia } = req.body;
    try {
        const response = await fetch(`http://localhost:${PUERTO}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contrasenia })
        });
        const data = await response.json();
        if (data.token) {
            res.redirect("/dashboard");
        } else {
            res.render("login", { error: "Email o contraseña incorrectos" });
        }
    } catch (error) {
        res.render("login", { error: "Error al conectar con el servidor" });
    }
});

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.use("/api/v1/especialidades", v1EspecialidadesRutas);

app.listen(PUERTO, () => {
    console.log(`Servidor iniciado OK en el puerto: ${PUERTO}`);
});