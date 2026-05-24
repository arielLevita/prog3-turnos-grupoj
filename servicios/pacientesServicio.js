import Pacientes from "../db/pacientesDb.js";

export default class PacientesServicio {
    constructor() {
        this.pacientes = new Pacientes();
    }

    buscarTodos = async () => {
        return await this.pacientes.buscarTodos();
    }

    buscarPorId = async (id) => {
        return await this.pacientes.buscarPorId(id);
    }

    crear = async (id_usuario, id_obra_social) => {
        return await this.pacientes.crear(id_usuario, id_obra_social);
    }

    modificar = async (id, id_usuario, id_obra_social) => {
        return await this.pacientes.modificar(id, id_usuario, id_obra_social);
    }

    borrar = async (id) => {
        return await this.pacientes.borrar(id);
    }
} 