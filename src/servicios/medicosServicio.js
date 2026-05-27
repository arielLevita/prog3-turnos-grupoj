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
        return await this.db.crear(medicoCreateDto);
    }

    modificar = async (id, medicoCreateDto) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        await this.db.modificar(id, medicoCreateDto);
        return id;
    }

    borrar = async (id) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        // Esto apagará la cuenta de usuario vinculada a este médico
        await this.db.borrar(id);
        return id;
    }
}