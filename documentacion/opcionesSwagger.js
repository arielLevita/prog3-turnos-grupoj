import swaggerJsdoc from "swagger-jsdoc";
import fs from 'fs';

const usuariosDocs = JSON.parse(fs.readFileSync(new URL('./usuariosDocs.json', import.meta.url), 'utf-8'));
const turnosDocs = JSON.parse(fs.readFileSync(new URL('./turnosDocs.json', import.meta.url), 'utf-8'));
const especialidadesDocs = JSON.parse(fs.readFileSync(new URL('./especialidadesDocs.json', import.meta.url), 'utf-8'));
const obrasSocialesDocs = JSON.parse(fs.readFileSync(new URL('./obrasSocialesDocs.json', import.meta.url), 'utf-8'));
const pacientesDocs = JSON.parse(fs.readFileSync(new URL('./pacientesDocs.json', import.meta.url), 'utf-8'));
const medicosDocs = JSON.parse(fs.readFileSync(new URL('./medicosDocs.json', import.meta.url), 'utf-8'));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Turnos Grupo J',
            version: '2.0.0',
            description: 'Documentación interactiva de la API para el Trabajo Integrador'
        },
        servers: [{ url: `http://localhost:${process.env.PUERTO || 3007}` }],
        
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            },
            schemas: {
                ...usuariosDocs.components.schemas,
                ...turnosDocs.components.schemas,
                ...especialidadesDocs.components.schemas,
                ...obrasSocialesDocs.components.schemas,
                ...pacientesDocs.components.schemas,
                ...medicosDocs.components.schemas
            }
        },
        security: [{
            bearerAuth: []
        }],
        paths: {
            ...usuariosDocs.paths,
            ...turnosDocs.paths,
            ...especialidadesDocs.paths,
            ...obrasSocialesDocs.paths,
            ...pacientesDocs.paths,
            ...medicosDocs.paths
        }
    },
    apis: [],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;