import ObrasSocialesServicio from '../servicios/obrasSocialesServicio.js';

export default class ObrasSocialesControlador {
    constructor() {
        this.servicio = new ObrasSocialesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const { filter, limit, offset, order } = req.query;
            const obrasSociales = await this.servicio.buscarTodas(filter, limit, offset, order);
            res.status(200).json(obrasSociales);
        } catch (error) {
            console.error("Error en buscarTodas (Obras Sociales):", error);
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_obra_social;
            const obraSocial = await this.servicio.buscarPorId(id);
            if (!obraSocial) {
                return res.status(404).json({ error: 'Obra Social no encontrada' });
            }
            res.status(200).json(obraSocial);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    crear = async (req, res) => {
        try {
            // Usamos req.dto que fue limpiado previamente por nuestro middleware
            const idGenerado = await this.servicio.crear(req.dto);
            res.status(201).json({ estado: true, msg: `Obra Social creada con ID ${idGenerado}` });
        } catch (error) {
            // Manejamos el error si intentan meter un nombre duplicado (Unique Constraint)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Ya existe una obra social con ese nombre' });
            }
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_obra_social;
            const idModificado = await this.servicio.modificar(id, req.dto);
            
            if (!idModificado) {
                return res.status(404).json({ error: 'Obra Social no encontrada' });
            }
            res.status(200).json({ estado: true, msg: 'Obra Social modificada con éxito' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Ya existe una obra social con ese nombre' });
            }
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_obra_social;
            const idBorrado = await this.servicio.borrar(id);
            if (!idBorrado) {
                return res.status(404).json({ error: 'Obra Social no encontrada' });
            }
            res.status(200).json({ estado: true, msg: 'Obra Social eliminada (Soft Delete)' });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }
}