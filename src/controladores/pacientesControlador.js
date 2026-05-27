import PacientesServicio from '../servicios/pacientesServicio.js';

export default class PacientesControlador {
    constructor() {
        this.servicio = new PacientesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const { filter, limit, offset, order } = req.query;
            const pacientes = await this.servicio.buscarTodas(filter, limit, offset, order);
            res.status(200).json(pacientes);
        } catch (error) {
            console.error("Error en buscarTodas (Pacientes):", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_paciente;
            const paciente = await this.servicio.buscarPorId(id);
            if (!paciente) {
                return res.status(404).json({ error: 'Paciente no encontrado' });
            }
            res.status(200).json(paciente);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const idGenerado = await this.servicio.crear(req.dto);
            res.status(201).json({ estado: true, msg: `Paciente registrado con ID ${idGenerado}` });
        } catch (error) {
            // Manejamos errores de llave foránea (si mandan un idUsuario que no existe)
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: 'El ID de Usuario o de Obra Social no existe' });
            }
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_paciente;
            const idModificado = await this.servicio.modificar(id, req.dto);
            
            if (!idModificado) {
                return res.status(404).json({ error: 'Paciente no encontrado' });
            }
            res.status(200).json({ estado: true, msg: 'Datos del paciente modificados con éxito' });
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: 'El ID de Usuario o de Obra Social no existe' });
            }
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_paciente;
            const idBorrado = await this.servicio.borrar(id);
            if (!idBorrado) {
                return res.status(404).json({ error: 'Paciente no encontrado' });
            }
            res.status(200).json({ estado: true, msg: 'Paciente eliminado lógicamente (Usuario desactivado)' });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}