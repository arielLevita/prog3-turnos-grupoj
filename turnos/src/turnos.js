import express from "express";
import  testConexion  from "./db/test-conexion.js";
import { router as v1EspecialidadesRutas } from "./rutas/v1/especialidadesRutas.js";
// Importamos el guardia del profe de Teoría
import validateContentType from "./middlewares/validateContentType.js";
import { router as v1ObrasSocialesRutas } from "./rutas/v1/obrasSocialesRutas.js";


// --- EXTRAS DE SEGURIDAD (Próximamente) ---
// Cuando el profe lo pida, instalá: npm install helmet cors morgan
// y descomentá estas tres líneas:
// import helmet from "helmet";
// import cors from "cors";
// import morgan from "morgan";

const app = express();


// --- APLICAR MIDDLEWARES GLOBALES ---

// 1. Morgan (Log de peticiones para ver quién entra a la API)
// app.use(morgan('dev'));

// 2. Helmet (Seguridad contra ataques web ocultando cabeceras de Express)[cite: 5]
// app.use(helmet());

// 3. CORS (Permite que un Frontend en React se conecte a esta API)[cite: 5]
// const corsOptions = {
//     origin: 'http://localhost:5173', // Acá iría el puerto de tu React (Vite usa el 5173 normalmente)
//     optionsSuccessStatus: 200, 
// };
// app.use(cors(corsOptions));


// 1. Aplicamos el guardia ANTES de leer el body
app.use(validateContentType);

// 2. Le decimos a Express que entienda JSON
app.use(express.json());

// 3. Ruta base para ver si el servidor funciona
app.get('/', (req, res) => {
    res.status(200).json({ estado: true, msg: 'API funcionando OK' });
});

// 4. Conectamos nuestras rutas de especialidades
app.use('/api/v1/especialidades', v1EspecialidadesRutas);
app.use('/api/v1/obras-sociales', v1ObrasSocialesRutas);

// 5. Configuración del puerto (¡Sin process.loadEnvFile() porque ya está en el package.json!)
const PUERTO = process.env.PUERTO || 3007;

app.listen(PUERTO, async () => {
    console.log(`🚀 Servidor iniciado OK en el puerto ${PUERTO}`);
    await testConexion();
});