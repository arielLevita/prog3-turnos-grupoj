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
            const nuevoMedico = await this.servicio.crear(req.dto);
            res.status(201).json({ estado: true, medico: nuevoMedico });
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
            const medicoModificado = await this.servicio.modificar(id, req.dto);
            
            if (!medicoModificado) {
                return res.status(404).json({ error: 'Médico no encontrado' });
            }
            res.status(200).json({ estado: true, medico: medicoModificado });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'La matrícula ya se encuentra registrada a otro médico' });
            }
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    asociarObrasSociales = async (req, res) => {
        try {
            const id_medico = req.params.id_medico;
            const obras_sociales = req.body.obras_sociales;

            if (!obras_sociales || !Array.isArray(obras_sociales) || obras_sociales.length === 0) {
                return res.status(400).json({ estado: false, msg: 'Debe enviar un array de obras_sociales' });
            }

            const resultado = await this.servicio.asociarObrasSociales(id_medico, obras_sociales);

            if (!resultado) {
                return res.status(404).json({ estado: false, msg: 'Médico no encontrado' });
            }

            res.status(201).json({ estado: true, msg: 'Obras sociales asociadas correctamente' });

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'Esos datos ya están en uso' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    desasociarObraSocial = async (req, res) => {
        try {
            const id_medico = req.params.id_medico;
            const id_obra_social = req.params.id_obra_social;

            const resultado = await this.servicio.desasociarObraSocial(id_medico, id_obra_social);

            if (resultado === null) {
                return res.status(404).json({ estado: false, msg: 'Médico no encontrado' });
            }

            if (resultado === false) {
                return res.status(404).json({ estado: false, msg: 'La obra social no estaba asociada a este médico' });
            }

            return res.status(204).send();

        } catch (error) {
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

   

   