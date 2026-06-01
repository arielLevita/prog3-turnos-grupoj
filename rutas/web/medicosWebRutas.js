import express from 'express';
import MedicosServicio from '../../servicios/medicosServicio.js';

const router = express.Router();
const medicosServicio = new MedicosServicio();

router.get('/', async (req, res) => {
    try {
        const medicos = await medicosServicio.buscarTodas();
        const medicosParaVista = JSON.parse(JSON.stringify(medicos));

        res.render('medicos', { 
            medicos: medicosParaVista 
        });
    } catch (error) {
        console.error("Error al cargar la vista de medicos:", error);
        res.status(500).send("Error interno del servidor al cargar la vista.");
    }
});

export { router };
