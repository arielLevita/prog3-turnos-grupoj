import ObrasSocialesServicio from "../servicios/obrasSocialesServicio.js";

export default class ObrasSocialesControlador {
    constructor() {
        this.obrasSociales = new ObrasSocialesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const obrasSociales = await this.obrasSociales.buscarTodas();

            if (obrasSociales.length === 0) {
                return res.status(404).json({ estado: false, msg: 'No hay obras sociales registradas' });
            }

            res.status(200).json(obrasSociales);
        } catch (error) {
            console.log(`Error en GET /obrasSociales ${error}`);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_obra_social;
            const obraSocial = await this.obrasSociales.buscarPorId(id);

            if (obraSocial.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Obra Social no encontrada' });
            }

            res.status(200).json(obraSocial);
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
            const resultado = await this.obrasSociales.crear(nombre, descripcion, porcentaje_descuento, es_particular);

            if (resultado.affectedRows > 0) {
                res.status(201).json({ estado: true, msg: `ID Creado ${resultado.insertId}` });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'La obraSocial ya existe' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    modificar = async (req, res) => {

        try {

            const id = req.params.id_obra_social;

            const existe = await this.obrasSociales.buscarPorId(id);

            if (existe.length === 0) {

                return res.status(404).json({
                    estado: false,
                    msg: 'Obra Social no encontrada'
                });
            }

            const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;

            const resultado = await this.obrasSociales.modificar( id, nombre, descripcion, porcentaje_descuento, es_particular );


            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Obra Social modificada' });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'Ese nombre de Obra Social ya está en uso' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_obra_social;

            const existe = await this.obrasSociales.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Obra Social no encontrada' });
            }

            const resultado = await this.obrasSociales.borrar(id);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Obra Social eliminada' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }
} 