import Reservas from "../db/reservasDb.js";

export default class ReservasServicio {
    constructor() {
        this.reservas = new Reservas();
    }

    buscarTurnosPropiosPaciente = async (id) => {
        return await this.reservas.buscarTurnosPropiosPaciente(id);
    }
    buscarTurnosPropiosMedicos = async (id) => {
        return await this.reservas.buscarTurnosPropiosMedicos(id);
    }

    buscarPorId = async (id) => {
        return await this.reservas.buscarPorId(id);
    }

    crear = async ( id_medico,id_paciente, id_obra_social, fecha_hora, valor_total, atentido) => {
        return await this.reservas.crear(id_medico,id_paciente, id_obra_social, fecha_hora, valor_total, atentido);
    }

    modificar = async (id, fecha_hora, atentido) => {
        return await this.reservas.modificar(id, fecha_hora, atentido);
    }

    marcarAtendido = async (id, atentido) => {
        return await this.reservas.marcarAtendido(id, atentido);
    }

    borrar = async (id) => {
        return await this.reservas.borrar(id);
    }
} 