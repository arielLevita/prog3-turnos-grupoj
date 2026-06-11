import TurnosServicio from '../servicios/turnosServicio.js';

export default class TurnosControlador {
    constructor() {
        this.servicio = new TurnosServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const { filter, limit, offset, order } = req.query;
            const turnos = await this.servicio.buscarTodas(req.user, filter, limit, offset, order);
            res.status(200).json(turnos);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_turno;
            const turno = await this.servicio.buscarPorId(id);
            if (!turno) {
                return res.status(404).json({ error: 'Turno no encontrado' });
            }
            res.status(200).json(turno);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const idGenerado = await this.servicio.crear(req.dto);
            res.status(201).json({ estado: true, msg: `Turno creado con ID ${idGenerado}` });
        } catch (error) {
            if (error.message === 'MEDICO_NO_ENCONTRADO') {
                return res.status(400).json({ error: 'El médico especificado no existe o está inactivo' });
            }
            if (error.message === 'PACIENTE_NO_ENCONTRADO') {
                return res.status(400).json({ error: 'El paciente especificado no existe o está inactivo' });
            }
            if (error.message === 'OBRA_SOCIAL_NO_ENCONTRADA') {
                return res.status(400).json({ error: 'La obra social especificada no existe o está inactiva' });
            }
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: 'El ID de paciente u otra referencia no es válido' });
            }

            console.error(error);
            res.status(500).json({ error: 'Error al procesar la transacción del turno' });
        }
    }

    marcarAtendido = async (req, res) => {
        try {
            const id = req.params.id_turno;
            const idModificado = await this.servicio.marcarAtendido(id);
            
            if (!idModificado) {
                return res.status(404).json({ error: 'Turno no encontrado' });
            }
            res.status(200).json({ estado: true, msg: 'Turno marcado como atendido' });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_turno;
            const idBorrado = await this.servicio.borrar(id);
            if (!idBorrado) {
                return res.status(404).json({ error: 'Turno no encontrado' });
            }
            res.status(200).json({ estado: true, msg: 'Turno eliminado (Soft Delete)' });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
