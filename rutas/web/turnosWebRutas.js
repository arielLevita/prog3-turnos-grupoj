import express from 'express';
import TurnosDb from '../../db/turnosDb.js';
import TurnoResponseDto from '../../dtos/turnoResponseDto.js';

const router = express.Router();
const turnosDb = new TurnosDb();

router.get('/', async (req, res) => {
    try {

        // Obtenemos directo de DB porque la ruta Web no tiene usuario logueado para pasarle al Servicio
        const turnosCrud = await turnosDb.buscarTodas();
        const turnos = turnosCrud.map(t => new TurnoResponseDto(t));

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
