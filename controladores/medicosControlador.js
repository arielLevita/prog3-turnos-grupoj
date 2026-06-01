import MedicosServicio from '../servicios/medicosServicio.js';

export default class MedicosControlador {
    constructor() {
        this.servicio = new MedicosServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const { filter, limit, offset, order } = req.query;
            const medicos = await this.servicio.buscarTodas(filter, limit, offset, order);
            res.status(200).json(medicos);
        } catch (error) {
            console.error("Error en buscarTodas (Médicos):", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_medico;
            const medico = await this.servicio.buscarPorId(id);
            if (!medico) {
                return res.status(404).json({ error: 'Médico no encontrado' });
            }
            res.status(200).json(medico);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const idGenerado = await this.servicio.crear(req.dto);
            res.status(201).json({ estado: true, msg: `Médico registrado con ID ${idGenerado}` });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'La matrícula ya se encuentra registrada a otro médico' });
            }
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_medico;
            const idModificado = await this.servicio.modificar(id, req.dto);
            
            if (!idModificado) {
                return res.status(404).json({ error: 'Médico no encontrado' });
            }
            res.status(200).json({ estado: true, msg: 'Datos del médico modificados con éxito' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'La matrícula ya se encuentra registrada a otro médico' });
            }
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    asociarMedicosObrasSociales = async (req, res) => {
        try {
            const id_medico = req.params.id_medico;
            const { obrasSociales } = req.body;

            const relacion = await this.servicio.relacionarConObraSocial(id_medico, obrasSociales);

            if (!relacion) {
                return res.status(400).json({ estado: false, msg: 'No se crearon las relaciones' });
            }

            res.status(201).json({ estado: true, msg: 'Relacion creada' });

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'Esos datos ya están en uso' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_medico;
            const idBorrado = await this.servicio.borrar(id);
            if (!idBorrado) {
                return res.status(404).json({ error: 'Médico no encontrado' });
            }
            res.status(200).json({ estado: true, msg: 'Médico eliminado lógicamente (Usuario desactivado)' });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

   

   