import ObrasSociales from "../db/obrasSociales.js";

export default class ObrasSocialesServicio {
    constructor() {
        // Instanciamos la clase de la Base de Datos
        this.obrasSociales = new ObrasSociales();
    }

    buscarTodas = async () => {
        return await this.obrasSociales.buscarTodas();
    }

    buscarPorId = async (id) => {
        return await this.obrasSociales.buscarPorId(id);
    }

    crear = async (datos) => {
        return await this.obrasSociales.crear(datos);
    }

    modificar = async (id, datos) => {
        return await this.obrasSociales.modificar(id, datos);
    }

    borrar = async (id) => {
        return await this.obrasSociales.borrar(id);
    }
}