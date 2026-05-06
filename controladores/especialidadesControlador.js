import EspecialidadesServicio from "../servicios/especialidadesServicio.js";

export default class EspecialidadesControlador {
    constructor() {
        this.especialidades = new EspecialidadesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const especialidades = await this.especialidades.buscarTodas();

            if (especialidades.length === 0) {
                return res.status(404).json({ estado: false, msg: 'No hay especialidades registradas' });
            }

            res.status(200).json(especialidades);
        } catch (error) {
            console.log(`Error en GET /especialidades ${error}`);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_especialidad;
            const especialidades = await this.especialidades.buscarPorId(id);

            if (especialidades.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }

            res.status(200).json(especialidades);
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const { nombre } = req.body;
            const resultado = await this.especialidades.crear(nombre);

            if (resultado.affectedRows > 0) {
                res.status(201).json({ estado: true, msg: `ID Creado ${resultado.insertId}` });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'La especialidad ya existe' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_especialidad;

            const existe = await this.especialidades.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }

            const { nombre } = req.body;
            const resultado = await this.especialidades.modificar(id, nombre);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Especialidad modificada' });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'Ese nombre de especialidad ya está en uso' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_especialidad;

            const existe = await this.especialidades.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }

            const resultado = await this.especialidades.borrar(id);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Especialidad eliminada' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }
} 