import Reservas from "../db/reservasDb.js";

export default class ReservasServicio {
    constructor() {
        this.reservas = new Reservas();
    }

    buscarTodos = async () => {
        return await this.reservas.buscarTodos();
    }

    buscarPorId = async (id) => {
        return await this.reservas.buscarPorId(id);
    }

    crear = async ( id_medico,id_paciente, id_obra_social, fecha_hora, valor_total, atentido) => {
        return await this.reservas.crear(id_medico,id_paciente, id_obra_social, fecha_hora, valor_total, atentido);
    }

    modificar = async (id, fecha_hora, valor_total, atentido) => {
        return await this.reservas.modificar(id, fecha_hora, valor_total, atentido);
    }

    borrar = async (id) => {
        return await this.reservas.borrar(id);
    }
} 