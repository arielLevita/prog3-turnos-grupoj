import MedicosServicio from "../servicios/medicosServicio.js";

export default class MedicosControlador {
    constructor() {
        this.medicos = new MedicosServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const medicos = await this.medicos.buscarTodos();

            if (medicos.length === 0) {
                return res.status(404).json({ estado: false, msg: 'No hay medicos registrados' });
            }

            res.status(200).json(medicos);
        } catch (error) {
            console.log(`Error en GET /medicos ${error}`);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_medico;
            const medico = await this.medicos.buscarPorId(id);

            if (medico.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Medico no encontrado' });
            }

            res.status(200).json(medico);
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const { id_usuario, id_especialidad, matricula, descripcion, valor_consulta } = req.body;
            const resultado = await this.medicos.crear(id_usuario, id_especialidad, matricula, descripcion, valor_consulta);

            if (resultado.affectedRows > 0) {
                res.status(201).json({ estado: true, msg: `ID Creado ${resultado.insertId}` });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'El medico ya existe' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_medico;

            const existe = await this.medicos.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Medico no encontrado' });
            }

            const { matricula, descripcion, valor_consulta } = req.body;
            const resultado = await this.medicos.modificar(id, matricula, descripcion, valor_consulta);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Modificacion realizada' });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'Esos datos ya están en uso' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    asociarMedicosObrasSociales = async (req, res) => {
        try {
            const id_medico = req.params.id_medico;
            const { obrasSociales } = req.body;

            const relacion = await this.medicos.relacionarConObraSocial(id_medico, obrasSociales);

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

            const existe = await this.medicos.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Medico no encontrado' });
            }

            const id_usuario = existe[0].id_usuario;

            const resultado = await this.medicos.borrar(id_usuario);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Medico eliminado' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }
} 