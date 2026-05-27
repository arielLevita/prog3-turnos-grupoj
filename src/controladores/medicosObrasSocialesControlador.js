import MedicosObrasSocialesServicio from '../servicios/medicosObrasSocialesServicio.js';

export default class MedicosObrasSocialesControlador {
    constructor() {
        this.servicio = new MedicosObrasSocialesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const { filter, limit, offset, order } = req.query;
            const relaciones = await this.servicio.buscarTodas(filter, limit, offset, order);
            res.status(200).json(relaciones);
        } catch (error) {
            console.error("Error en buscarTodas (MedicosObrasSociales):", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_medico_obra_social;
            const relacion = await this.servicio.buscarPorId(id);
            if (!relacion) {
                return res.status(404).json({ error: 'Relación no encontrada' });
            }
            res.status(200).json(relacion);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const idGenerado = await this.servicio.crear(req.dto);
            res.status(201).json({ estado: true, msg: `Asociación creada con ID ${idGenerado}` });
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: 'El ID de Médico o de Obra Social no existe' });
            }
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_medico_obra_social;
            const idModificado = await this.servicio.modificar(id, req.dto);
            
            if (!idModificado) {
                return res.status(404).json({ error: 'Relación no encontrada' });
            }
            res.status(200).json({ estado: true, msg: 'Asociación modificada con éxito' });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_medico_obra_social;
            const idBorrado = await this.servicio.borrar(id);
            if (!idBorrado) {
                return res.status(404).json({ error: 'Relación no encontrada' });
            }
            res.status(200).json({ estado: true, msg: 'Asociación eliminada' });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}