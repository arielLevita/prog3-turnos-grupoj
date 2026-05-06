import Especialidades from "../db/especialidadesDb.js";

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