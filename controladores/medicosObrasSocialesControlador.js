import MedicosObrasSocialesServicio from "../servicios/medicosObrasSocialesServicio.js";

export default class MedicosObrasSocialesControlador {
    constructor() {
        this.medicosObrasSociales = new MedicosObrasSocialesServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const medicosObrasSociales = await this.medicosObrasSociales.buscarTodos();

            if (medicosObrasSociales.length === 0) {
                return res.status(404).json({ estado: false, msg: 'No hay medicos registrados con Obras Sociales' });
            }

            res.status(200).json(medicosObrasSociales);
        } catch (error) {
            console.log(`Error en GET /medicosObrasSociales ${error}`);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_medico_obra_social;
            const medicoObraSocial = await this.medicosObrasSociales.buscarPorId(id);

            if (medicoObraSocial.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Medico no encontrado' });
            }

            res.status(200).json(medicoObraSocial);
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const { id_medico, id_obra_social } = req.body;
            const resultado = await this.medicosObrasSociales.crear(id_medico, id_obra_social);

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
            const id = req.params.id_medico_obra_social;

            const existe = await this.medicosObrasSociales.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Medico no encontrado' });
            }

            const { id_medico, id_obra_social } = req.body;
            const resultado = await this.medicosObrasSociales.modificar(id, id_medico, id_obra_social);

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
            const id = req.params.id_medico_obra_social;

            const existe = await this.medicosObrasSociales.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Medico no encontrado' });
            }

            const resultado = await this.medicosObrasSociales.borrar(id);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'El medico ha dejado de atender por esa obra social' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }
} 