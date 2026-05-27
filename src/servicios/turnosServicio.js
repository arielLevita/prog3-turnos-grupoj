import TurnosDb from '../db/turnosDb.js';
import MedicosDb from '../db/medicosDb.js';
import ObrasSocialesDb from '../db/obrasSocialesDb.js';
import TurnoResponseDto from '../dtos/turnoResponseDto.js';

export default class TurnosServicio {
    constructor() {
        this.turnosDb = new TurnosDb();
        // Instanciamos las otras DB para poder leer los precios y descuentos
        this.medicosDb = new MedicosDb();
        this.obrasSocialesDb = new ObrasSocialesDb();
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
        // 1. Buscamos al médico para saber cuánto cobra
        const medico = await this.medicosDb.buscarPorId(turnoCreateDto.idMedico);
        if (!medico) throw new Error('MEDICO_NO_ENCONTRADO');

        // 2. Buscamos la obra social para saber el descuento
        const obraSocial = await this.obrasSocialesDb.buscarPorId(turnoCreateDto.idObraSocial);
        if (!obraSocial) throw new Error('OBRA_SOCIAL_NO_ENCONTRADA');

        // 3. LÓGICA DE NEGOCIO (El requerimiento del PDF)
        let valorTotalCalculado = 0;
        const valorConsulta = parseFloat(medico.valor_consulta);
        const porcentajeDescuento = parseFloat(obraSocial.porcentaje_descuento);

        if (obraSocial.es_particular === 1) {
            // Si es particular, paga el 100% de la consulta
            valorTotalCalculado = valorConsulta;
        } else {
            // Si NO es particular, aplicamos el porcentaje de descuento
            // Fórmula: ValorConsulta - (Descuento * ValorConsulta / 100)
            const descuentoAplicado = (porcentajeDescuento * valorConsulta) / 100;
            valorTotalCalculado = valorConsulta - descuentoAplicado;
        }

        // 4. Le pasamos el DTO y el cálculo final a la capa DB para la Transacción
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