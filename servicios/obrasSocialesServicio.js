import ObrasSociales from "../db/obrasSocialesDb.js";

export default class ObrasSocialesServicio {
    constructor() {
        this.obrasSociales = new ObrasSociales();
    }

    buscarTodas = async () => {
        return await this.obrasSociales.buscarTodas();
    }

    buscarPorId = async (id) => {
        return await this.obrasSociales.buscarPorId(id);
    }

    crear = async (nombre, descripcion, porcentaje_descuento, es_particular) => {
        return await this.obrasSociales.crear(nombre, descripcion, porcentaje_descuento, es_particular);
    }

    modificar = async (id, nombre, descripcion, porcentaje_descuento, es_particular) => {
        return await this.obrasSociales.modificar(id, nombre, descripcion, porcentaje_descuento, es_particular);
    }

    borrar = async (id) => {
        return await this.obrasSociales.borrar(id);
    }
} 