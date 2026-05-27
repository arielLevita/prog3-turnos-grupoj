import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
// Importamos la función de prueba sin llaves porque es 'export default'
import testConexion from "./db/test-conexion.js";
import validateContentType from "./middlewares/validateContentType.js";
import { router as v2EspecialidadesRutas } from "./rutas/v2/especialidadesRutas.js";
import { router as v2ObrasSocialesRutas } from "./rutas/v2/obrasSocialesRutas.js";
import { router as v2UsuariosRutas } from "./rutas/v2/usuariosRutas.js";
import { router as v2MedicosRutas } from "./rutas/v2/medicosRutas.js";
import { router as v2PacientesRutas } from "./rutas/v2/pacientesRutas.js";
import { router as v2MedicosObrasSocialesRutas } from "./rutas/v2/medicosObrasSocialesRutas.js";
import { router as v2TurnosRutas } from "./rutas/v2/turnosRutas.js";

// Inicializamos la aplicación Express
const app = express();

// --- 1. MIDDLEWARES GLOBALES (SEGURIDAD Y FORMATO) ---

// Helmet agrega cabeceras de seguridad automáticas para proteger la API de ataques comunes.
app.use(helmet());

// CORS permite que el Frontend (que suele estar en otro puerto) pueda pedirle datos a este Backend.
app.use(cors());

// validateContentType es nuestro guardia que asegura que solo nos manden datos en formato JSON.
app.use(validateContentType);

// express.json lee el cuerpo (body) de las peticiones y lo transforma en un objeto JS fácil de usar.
app.use(express.json({ type: 'application/json' }));


// --- 2. CONFIGURACIÓN DE SWAGGER (DOCUMENTACIÓN) ---

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { 
            title: 'API Turnos Grupo J', 
            version: '1.0.0',
            description: 'Documentación interactiva de la API para el Trabajo Integrador'
        },
        // Usamos el puerto de las variables de entorno o el 3007 por defecto
        servers: [{ url: `http://localhost:${process.env.PUERTO || 3007}` }],
    },
    // Buscamos los comentarios de Swagger en todos los archivos JS de la carpeta de rutas
    apis: ['./src/rutas/v2/*.js'],
};

// Generamos y servimos la documentación en la ruta /api-docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// --- 3. DEFINICIÓN DE RUTAS ---

// Ruta raíz: Sirve para que el profesor vea rápido que el servidor está encendido.
app.get('/', (req, res) => res.status(200).json({ estado: true, msg: 'API funcionando OK' }));

// Montamos las rutas de cada entidad con el prefijo de versión /api/v2
app.use('/api/v2/especialidades', v2EspecialidadesRutas);
app.use('/api/v2/obras-sociales', v2ObrasSocialesRutas);
app.use('/api/v2/usuarios', v2UsuariosRutas);
app.use('/api/v2/medicos', v2MedicosRutas);
app.use('/api/v2/pacientes', v2PacientesRutas);
app.use('/api/v2/medicos-obras-sociales', v2MedicosObrasSocialesRutas);
app.use('/api/v2/turnos-reservas', v2TurnosRutas);

// --- 4. INICIO DEL SERVIDOR ---

// Definimos el puerto (estándar del grupo: 3007)
const PUERTO = process.env.PUERTO || 3007;

app.listen(PUERTO, async () => {
    console.log(`🚀 Servidor iniciado OK en el puerto ${PUERTO}`);
    console.log(`📄 Documentación disponible en http://localhost:${PUERTO}/api-docs`);
    
    // Llamamos a la función que prueba la conexión a MySQL
    await testConexion();
});