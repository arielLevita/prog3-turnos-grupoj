import PacientesServicio from "../servicios/pacientesServicio.js";

export default class PacientesControlador {
    constructor() {
        this.pacientes = new PacientesServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const pacientes = await this.pacientes.buscarTodos();

            if (pacientes.length === 0) {
                return res.status(404).json({ estado: false, msg: 'No hay pacientes registrados' });
            }

            res.status(200).json(pacientes);
        } catch (error) {
            console.log(`Error en GET /pacientes ${error}`);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_paciente;
            const paciente = await this.pacientes.buscarPorId(id);

            if (paciente.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Paciente no encontrado' });
            }

            res.status(200).json(paciente);
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const { id_usuario, id_obra_social } = req.body;
            const resultado = await this.pacientes.crear(id_usuario, id_obra_social);

            if (resultado.affectedRows > 0) {
                res.status(201).json({ estado: true, msg: `ID Creado ${resultado.insertId}` });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'El paciente ya existe' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_paciente;

            const existe = await this.pacientes.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Paciente no encontrado' });
            }

            const { id_usuario, id_obra_social } = req.body;
            const resultado = await this.pacientes.modificar(id, id_usuario, id_obra_social);

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

    borrar = async (req, res) => {
        try {
            const id = req.params.id_paciente;

            const existe = await this.pacientes.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Paciente no encontrado' });
            }

            const id_usuario = existe[0].id_usuario;

            const resultado = await this.pacientes.borrar(id_usuario);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Paciente eliminado' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }
} 