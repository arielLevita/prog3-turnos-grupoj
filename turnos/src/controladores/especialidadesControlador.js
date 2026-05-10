import EspecialidadesServicio from "../servicios/especialidadesServicio.js";

// El Controlador da la cara. Habla con el cliente (Bruno/React), maneja req y res.
export default class EspecialidadesControlador {
    constructor() {
        this.especialidades = new EspecialidadesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const especialidades = await this.especialidades.buscarTodas();
            
            // Sugerencia del profe: Si está vacío, devolvemos 404
            if (especialidades.length === 0) {
                return res.status(404).json({ estado: false, msg: 'No hay especialidades registradas' });
            }

            res.status(200).json({ estado: true, especialidades: especialidades });
        } catch (error) {
            console.log(`Error en GET /especialidades ${error}`);
            res.status(500).json({ estado: false, msg: 'Error interno' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_especialidad;
            const especialidades = await this.especialidades.buscarPorId(id);

            // Validamos que exista
            if (especialidades.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }

            res.status(200).json({ estado: true, especialidades: especialidades });
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno' });
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
            // Manejamos el error de MySQL si intentan crear una especialidad que ya existe
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'La especialidad ya existe' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno' });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_especialidad;
            
            // EL DOBLE CHEQUEO: Primero vemos si existe
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
                return res.status(400).json({ estado: false, msg: 'Ese nombre ya está en uso' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno' });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_especialidad;
            
            // EL DOBLE CHEQUEO
            const existe = await this.especialidades.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }

            // Hacemos el borrado lógico (UPDATE activo = 0)
            const resultado = await this.especialidades.borrar(id);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Especialidad eliminada' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno' });
        }
    }
}