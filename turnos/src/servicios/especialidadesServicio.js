import Especialidades from "../db/especialidades.js";

// El servicio coordina. Instancia la base de datos y llama a sus métodos.
export default class EspecialidadesServicio {
    constructor() {
        this.especialidades = new Especialidades();
    }

    buscarTodas = async () => {
        return await this.especialidades.buscarTodas();
    }

    buscarPorId = async (id) => {
        return await this.especialidades.buscarPorId(id);
    }

    crear = async (nombre) => {
        return await this.especialidades.crear(nombre);
    }

    modificar = async (id, nombre) => {
        return await this.especialidades.modificar(id, nombre);
    }

    borrar = async (id) => {
        return await this.especialidades.borrar(id);
    }
}