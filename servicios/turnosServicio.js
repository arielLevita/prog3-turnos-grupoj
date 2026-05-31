import TurnosDb from '../db/turnosDb.js';
import MedicosServicio from './medicosServicio.js';
import ObrasSocialesServicio from './obrasSocialesServicio.js';
import PacientesServicio from './pacientesServicio.js';
import TurnoResponseDto from '../dtos/turnoResponseDto.js';

export default class TurnosServicio {
    constructor() {
        this.turnosDb = new TurnosDb();
        // Instanciamos los SERVICIOS para la Orquestación entre capas
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
        // 1. Buscamos al médico para saber cuánto cobra (a través de su SERVICIO)
        const medico = await this.medicosServicio.buscarPorId(turnoCreateDto.idMedico);
        if (!medico) throw new Error('MEDICO_NO_ENCONTRADO');

        // 2. Buscamos al paciente para obtener su obra social
        const paciente = await this.pacientesServicio.buscarPorId(turnoCreateDto.idPaciente);
        if (!paciente) throw new Error('PACIENTE_NO_ENCONTRADO');

        // 3. Buscamos la obra social del paciente para saber el descuento
        const obraSocial = await this.obrasSocialesServicio.buscarPorId(paciente.idObraSocial);
        if (!obraSocial) throw new Error('OBRA_SOCIAL_NO_ENCONTRADA');

        // Forzamos que la obra social del turno sea la del paciente (usando propiedad del DTO)
        turnoCreateDto.idObraSocial = paciente.idObraSocial;

        // 4. LÓGICA DE NEGOCIO (El requerimiento del PDF)
        let valorTotalCalculado = 0;
        
        // Al usar Servicios, los objetos (medico y obraSocial) ya vienen como DTOs
        // Por lo tanto, usamos sus propiedades en camelCase y ya tienen el tipo correcto
        const valorConsulta = medico.valorConsulta;
        const porcentajeDescuento = obraSocial.porcentajeDescuento;

        if (obraSocial.esParticular === true) {
            // Si es particular, paga el 100% de la consulta
            valorTotalCalculado = valorConsulta;
        } else {
            // Si NO es particular, aplicamos el porcentaje de descuento
            // Fórmula: ValorConsulta - (Descuento * ValorConsulta / 100)
            const descuentoAplicado = (porcentajeDescuento * valorConsulta) / 100;
            valorTotalCalculado = valorConsulta - descuentoAplicado;
        }

        // 5. Le pasamos el DTO y el cálculo final a la capa DB para la Transacción
        return await this.turnosDb.crear(turnoCreateDto, valorTotalCalculado);
    }

    // Un método simple para que el médico cambie "atentido = 1"
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