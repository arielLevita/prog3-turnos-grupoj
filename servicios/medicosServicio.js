import Medicos from "../db/medicosDb.js";

export default class MedicosServicio {
    constructor() {
        this.medicos = new Medicos();
    }

    buscarTodos = async () => {
        return await this.medicos.buscarTodos();
    }

    buscarPorId = async (id) => {
        return await this.medicos.buscarPorId(id);
    }

    crear = async (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) => {
        return await this.medicos.crear(id_usuario, id_especialidad, matricula, descripcion, valor_consulta);
    }

    modificar = async (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) => {
        return await this.medicos.modificar(id_usuario, id_especialidad, matricula, descripcion, valor_consulta);
    }

    relacionarConObraSocial = async (id_medico, obrasSociales) => {
        return await this.medicos.relacionarConObraSocial( id_medico, obrasSociales);
    }

    borrar = async (id) => {
        return await this.medicos.borrar(id);
    }
} 