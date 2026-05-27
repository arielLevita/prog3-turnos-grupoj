import MedicosObrasSocialesDb from '../db/medicosObrasSocialesDb.js';
import MedicoObraSocialResponseDto from '../dtos/medicoObraSocialResponseDto.js';

export default class MedicosObrasSocialesServicio {
    constructor() {
        this.db = new MedicosObrasSocialesDb();
    }

    buscarTodas = async (filters, limit, offset, order) => {
        const relaciones = await this.db.buscarTodas(filters, limit, offset, order);
        return relaciones.map(rel => new MedicoObraSocialResponseDto(rel));
    }

    buscarPorId = async (id) => {
        const relacion = await this.db.buscarPorId(id);
        if (!relacion) return null;
        return new MedicoObraSocialResponseDto(relacion);
    }

    crear = async (dto) => {
        return await this.db.crear(dto);
    }

    modificar = async (id, dto) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;
        await this.db.modificar(id, dto);
        return id;
    }

    borrar = async (id) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;
        await this.db.borrar(id);
        return id;
    }
}