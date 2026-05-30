import MedicosDb from '../db/medicosDb.js';
import MedicoResponseDto from '../dtos/medicoResponseDto.js';

export default class MedicosServicio {
    constructor() {
        this.db = new MedicosDb();
    }

    buscarTodas = async (filters, limit, offset, order) => {
        const medicosCrud = await this.db.buscarTodas(filters, limit, offset, order);
        return medicosCrud.map(medico => new MedicoResponseDto(medico));
    }

    buscarPorId = async (id) => {
        const medico = await this.db.buscarPorId(id);
        if (!medico) return null;
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
        // 1. Verificamos que el médico exista
        const medicoExiste = await this.db.buscarPorId(id_medico);
        if (!medicoExiste) return null;

        // 2. Extraemos los IDs asumiendo que llega el formato del profesor: [{id_obra_social: 1}]
        let idsNuevos = [];
        if (obras_sociales_nuevas.length > 0) {
            idsNuevos = obras_sociales_nuevas.map(os => parseInt(os.id_obra_social));
        }

        // 3. Limpiamos duplicados
        const obrasNuevasUnicas = [...new Set(idsNuevos)];

        // 4. Buscamos en la BD qué obras sociales YA tiene este médico
        const obrasExistentes = await this.db.buscarAsociacionesPorMedico(id_medico);

        // 5. Filtramos
        const obrasAInsertar = obrasNuevasUnicas.filter(id_nueva => !obrasExistentes.includes(id_nueva));

        // 6. Insertamos
        if (obrasAInsertar.length > 0) {
            await this.db.asociarMultiples(id_medico, obrasAInsertar);
        }

        return true;
    }

    desasociarObraSocial = async (id_medico, id_obra_social) => {
        // 1. Verificamos que el médico exista
        const medicoExiste = await this.db.buscarPorId(id_medico);
        if (!medicoExiste) return null; // Médico no existe

        // 2. Buscamos si la asociación realmente existe
        const obrasExistentes = await this.db.buscarAsociacionesPorMedico(id_medico);
        if (!obrasExistentes.includes(parseInt(id_obra_social))) {
            return false; // La asociación no existe
        }

        // 3. Borramos
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







    