import express from 'express';
import TurnosServicio from '../../servicios/turnosServicio.js';

const router = express.Router();
const turnosServicio = new TurnosServicio();

router.get('/', async (req, res) => {
    try {

        const turnos = await turnosServicio.buscarTodas();

        const turnosParaVista = JSON.parse(JSON.stringify(turnos));

        res.render('turnos', { 
            turnos: turnosParaVista 
        });
    } catch (error) {
        console.error("Error al cargar la vista de turnos:", error);
        res.status(500).send("Error interno del servidor al cargar la vista.");
    }
});

export { router };
