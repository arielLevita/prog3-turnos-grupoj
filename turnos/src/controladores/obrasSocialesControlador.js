import ObrasSocialesServicio from "../servicios/obrasSocialesServicio.js";

export default class ObrasSocialesControlador {
    constructor() {
        this.obrasSociales = new ObrasSocialesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const obras = await this.obrasSociales.buscarTodas();
            
            // Verificamos si hay datos
            if (obras.length === 0) {
                return res.status(404).json({ estado: false, msg: 'No hay obras sociales registradas' });
            }

            res.status(200).json({ estado: true, obras_sociales: obras });
        } catch (error) {
            console.log(`Error en GET /obras-sociales: ${error}`);
            res.status(500).json({ estado: false, msg: 'Error interno' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_obra_social;
            const obras = await this.obrasSociales.buscarPorId(id);

            if (obras.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Obra social no encontrada' });
            }

            res.status(200).json({ estado: true, obras_sociales: obras });
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno' });
        }
    }

    crear = async (req, res) => {
        try {
            // Extraemos los 4 campos del body
            const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
            // Los mandamos como un objeto al servicio
            const resultado = await this.obrasSociales.crear({ nombre, descripcion, porcentaje_descuento, es_particular });

            if (resultado.affectedRows > 0) {
                res.status(201).json({ estado: true, msg: `ID Creado ${resultado.insertId}` });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'La obra social ya existe' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno' });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_obra_social;
            
            // Doble chequeo
            const existe = await this.obrasSociales.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Obra social no encontrada' });
            }

            const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
            const resultado = await this.obrasSociales.modificar(id, { nombre, descripcion, porcentaje_descuento, es_particular });

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Obra social modificada' });
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
            const id = req.params.id_obra_social;
            
            // Doble chequeo
            const existe = await this.obrasSociales.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Obra social no encontrada' });
            }

            const resultado = await this.obrasSociales.borrar(id);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Obra social eliminada' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno' });
        }
    }
}