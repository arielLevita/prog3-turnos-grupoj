import TurnosDb from '../db/turnosDb.js';
import MedicosServicio from './medicosServicio.js';
import ObrasSocialesServicio from './obrasSocialesServicio.js';
import PacientesServicio from './pacientesServicio.js';
import TurnoResponseDto from '../dtos/turnoResponseDto.js';

export default class TurnosServicio {
    constructor() {
        this.turnosDb = new TurnosDb();
        this.medicosServicio = new MedicosServicio();
        this.obrasSocialesServicio = new ObrasSocialesServicio();
        this.pacientesServicio = new PacientesServicio();
    }

    buscarTodas = async (filters, limit, offset, order) => {
        const turnosCrud = await this.turnosDb.buscarTodas(filters, limit, offset, order);
        return turnosCrud.map(turno => new TurnoResponseDto(turno));
    }

    buscarPorId = async (id) => {
        const turno = await this.turnosDb.buscarPorId(id);
        if (!turno) return null;
        return new TurnoResponseDto(turno);
    }

    crear = async (turnoCreateDto) => {
        const medico = await this.medicosServicio.buscarPorId(turnoCreateDto.idMedico);
        if (!medico) throw new Error('MEDICO_NO_ENCONTRADO');

        const paciente = await this.pacientesServicio.buscarPorId(turnoCreateDto.idPaciente);
        if (!paciente) throw new Error('PACIENTE_NO_ENCONTRADO');

        const obraSocial = await this.obrasSocialesServicio.buscarPorId(paciente.idObraSocial);
        if (!obraSocial) throw new Error('OBRA_SOCIAL_NO_ENCONTRADA');

        turnoCreateDto.idObraSocial = paciente.idObraSocial;

        let valorTotalCalculado = 0;
        
        const valorConsulta = medico.valorConsulta;
        const porcentajeDescuento = obraSocial.porcentajeDescuento;

        if (obraSocial.esParticular === true) {
            valorTotalCalculado = valorConsulta;
        } else {
            const descuentoAplicado = (porcentajeDescuento * valorConsulta) / 100;
            valorTotalCalculado = valorConsulta - descuentoAplicado;
        }

        return await this.turnosDb.crear(turnoCreateDto, valorTotalCalculado);
    }

    marcarAtendido = async (id) => {
        const existe = await this.turnosDb.buscarPorId(id);
        if (!existe) return null;

        await this.turnosDb.modificar(id, "atentido = ?", [1]);
        return id;
    }

    borrar = async (id) => {
        const existe = await this.turnosDb.buscarPorId(id);
        if (!existe) return null;
        await this.turnosDb.borrar(id);
        return id;
    }
}