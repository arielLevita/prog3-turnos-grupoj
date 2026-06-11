import EspecialidadesServicio from "../servicios/especialidadesServicio.js";

export default class EspecialidadesControlador {
    constructor() {
        this.service = new EspecialidadesServicio();
    }

    buscarTodas = async (req, res) => {
        const { filter, limit, offset, order } = req.query;

        try {
            const especialidades = await this.service.buscarTodas(filter, limit, offset, order);
            
            if (especialidades.length === 0) {
                return res.status(404).json({ estado: false, msg: 'No hay especialidades registradas' });
            }

            res.status(200).json(especialidades);
        } catch (error) {
            console.error(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_especialidad;
            const especialidad = await this.service.buscarPorId(id);

            if (!especialidad) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }
            res.status(200).json( especialidad );
        } catch (error) {
            console.error(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        const especialidad = req.dto;

        try {
            const nuevaEspecialidad = await this.service.crear(especialidad);
            res.status(201).json({ estado: true, especialidad: nuevaEspecialidad });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'La especialidad ya existe' });
            }
            console.error(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    modificar = async (req, res) => {
        const id = req.params.id_especialidad;
        const especialidad = req.dto;

        try {
            const especialidadModificada = await this.service.modificar(id, especialidad);
            
            if (!especialidadModificada) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }

            res.status(200).json({ estado: true, especialidad: especialidadModificada });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'Ese nombre de especialidad ya está en uso' });
            }
            console.error(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    borrar = async (req, res) => {
        const id = req.params.id_especialidad;

        try {
            const idBorrado = await this.service.borrar(id);
            
            if (!idBorrado) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }

            res.status(200).json({ estado: true, msg: 'Especialidad eliminada' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }
}