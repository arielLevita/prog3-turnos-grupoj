import express from 'express';
import PacientesServicio from '../../servicios/pacientesServicio.js';

const router = express.Router();
const pacientesServicio = new PacientesServicio();

router.get('/', async (req, res) => {
    try {
        const pacientes = await pacientesServicio.buscarTodas();
        const pacientesParaVista = JSON.parse(JSON.stringify(pacientes));

        res.render('pacientes', { 
            pacientes: pacientesParaVista 
        });
    } catch (error) {
        console.error("Error al cargar la vista de pacientes:", error);
        res.status(500).send("Error interno del servidor al cargar la vista.");
    }
});

export { router };
