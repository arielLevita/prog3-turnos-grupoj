import ReservasServicio from "../servicios/reservasServicio.js";

export default class ReservasControlador {
    constructor() {
        this.reservas = new ReservasServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const reservas = await this.reservas.buscarTodos();

            if (reservas.length === 0) {
                return res.status(404).json({ estado: false, msg: 'No hay reservas registradas' });
            }

            res.status(200).json(reservas);
        } catch (error) {
            console.log(`Error en GET /reservas ${error}`);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_turno_reserva;
            const reserva = await this.reservas.buscarPorId(id);

            if (reserva.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Reserva no encontrado' });
            }

            res.status(200).json(reserva);
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const { id_medico,id_paciente, id_obra_social, fecha_hora, valor_total, atentido} = req.body;
            const resultado = await this.reservas.crear(id_medico,id_paciente, id_obra_social, fecha_hora, valor_total, atentido);

            if (resultado.affectedRows > 0) {
                res.status(201).json({ estado: true, msg: `ID Creado ${resultado.insertId}` });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'El reserva ya existe' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_turno_reserva;

            const existe = await this.reservas.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Reserva no encontrado' });
            }

            const { fecha_hora, valor_total, atentido } = req.body;
            const resultado = await this.reservas.modificar(id, fecha_hora, valor_total, atentido);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Reserva modificado' });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'Ese nombre de reserva ya está en uso' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_turno_reserva;

            const existe = await this.reservas.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Reserva no encontrado' });
            }

            const resultado = await this.reservas.borrar(id);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Reserva eliminado' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }
} 