import MedicosDb from '../db/medicosDb.js';
import MedicoResponseDto from '../dtos/medicoResponseDto.js';

export default class MedicosServicio {
    constructor() {
        this.db = new MedicosDb();
    }

    buscarTodas = async (filters, limit, offset, order) => {
        const medicosCrud = await this.db.buscarTodas(filters, limit, offset, order);
        
        const medicosCompletos = await Promise.all(medicosCrud.map(async (medico) => {
            medico.obrasSociales = await this.db.buscarObrasSocialesDetalle(medico.id_medico);
            return new MedicoResponseDto(medico);
        }));

        return medicosCompletos;
    }

    buscarPorId = async (id) => {
        const medico = await this.db.buscarPorId(id);
        if (!medico) return null;
        
        medico.obrasSociales = await this.db.buscarObrasSocialesDetalle(id);
        
        return new MedicoResponseDto(medico);
    }

    crear = async (medicoCreateDto) => {
        const nuevo_id = await this.db.crear(medicoCreateDto);
        return await this.buscarPorId(nuevo_id);
    }

    modificar = async (id, medicoCreateDto) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        await this.db.modificar(id, medicoCreateDto);
        return await this.buscarPorId(id);
    }

    asociarObrasSociales = async (id_medico, obras_sociales_nuevas) => {
        const medicoExiste = await this.db.buscarPorId(id_medico);
        if (!medicoExiste) return null;

        let idsNuevos = [];
        if (obras_sociales_nuevas.length > 0) {
            idsNuevos = obras_sociales_nuevas.map(os => parseInt(os.id_obra_social));
        }

        const obrasNuevasUnicas = [...new Set(idsNuevos)];
        const obrasExistentes = await this.db.buscarAsociacionesPorMedico(id_medico);
        const obrasAInsertar = obrasNuevasUnicas.filter(id_nueva => !obrasExistentes.includes(id_nueva));

        if (obrasAInsertar.length > 0) {
            await this.db.asociarMultiples(id_medico, obrasAInsertar);
        }

        return true;
    }

    desasociarObraSocial = async (id_medico, id_obra_social) => {
        const medicoExiste = await this.db.buscarPorId(id_medico);
        if (!medicoExiste) return null;

        const obrasExistentes = await this.db.buscarAsociacionesPorMedico(id_medico);
        if (!obrasExistentes.includes(parseInt(id_obra_social))) {
            return false;
        }

        await this.db.desasociarObraSocial(id_medico, id_obra_social);
        return true;
    }

    borrar = async (id) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        await this.db.borrar(id);
        return id;
    }
}

    