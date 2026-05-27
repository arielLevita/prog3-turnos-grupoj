import PacientesDb from '../db/pacientesDb.js';
import PacienteResponseDto from '../dtos/pacienteResponseDto.js';

export default class PacientesServicio {
    constructor() {
        this.db = new PacientesDb();
    }

    buscarTodas = async (filters, limit, offset, order) => {
        const pacientesCrud = await this.db.buscarTodas(filters, limit, offset, order);
        return pacientesCrud.map(paciente => new PacienteResponseDto(paciente));
    }

    buscarPorId = async (id) => {
        const paciente = await this.db.buscarPorId(id);
        if (!paciente) return null;
        return new PacienteResponseDto(paciente);
    }

    crear = async (pacienteCreateDto) => {
        return await this.db.crear(pacienteCreateDto);
    }

    modificar = async (id, pacienteCreateDto) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        await this.db.modificar(id, pacienteCreateDto);
        return id;
    }

    borrar = async (id) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        // Esto apagará la cuenta de usuario vinculada a este paciente
        await this.db.borrar(id);
        return id;
    }
}