import MedicosObrasSociales from "../db/medicosObrasSocialesDb.js";

export default class MedicosObrasSocialesServicio {
    constructor() {
        this.medicosObrasSociales = new MedicosObrasSociales();
    }

    buscarTodos = async () => {
        return await this.medicosObrasSociales.buscarTodos();
    }

    buscarPorId = async (id) => {
        return await this.medicosObrasSociales.buscarPorId(id);
    }

    crear = async (id_medico, id_obra_social) => {
        return await this.medicosObrasSociales.crear(id_medico, id_obra_social);
    }

    modificar = async (id, id_medico, id_obra_social) => {
        return await this.medicosObrasSociales.modificar(id, id_medico, id_obra_social);
    }

    borrar = async (id) => {
        return await this.medicosObrasSociales.borrar(id);
    }
} 