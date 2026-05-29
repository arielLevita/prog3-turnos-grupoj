import EspecialidadesDb from "../db/especialidadesDb.js";
import EspecialidadResponseDto from "../dtos/especialidadResponseDto.js";

export default class EspecialidadesServicio {
    static KEYS_MAP = {
        idEspecialidad: 'id_especialidad',
        nombre: 'nombre'
    };

    static mapKeysToColumns = (obj) => {
        if (obj === undefined || obj === null || Object.keys(obj).length === 0) return null;
        
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const column = EspecialidadesServicio.KEYS_MAP[key];
            if (column) acc[column] = value;
            return acc;
        }, {});
    };

    constructor() {
        this.especialidadesDb = new EspecialidadesDb();
    }

    buscarTodas = async (filter, limit, offset, order) => {
        const sqlFilter = EspecialidadesServicio.mapKeysToColumns(filter);
        const sqlOrder = EspecialidadesServicio.mapKeysToColumns(order);

        const tableResults = await this.especialidadesDb.buscarTodas(sqlFilter, limit, offset, sqlOrder);
        
        return tableResults.map(row => new EspecialidadResponseDto(row));
    }

    buscarPorId = async (id) => {
        const row = await this.especialidadesDb.buscarPorId(id);
        if (!row) return null;
        return new EspecialidadResponseDto(row);
    }

    crear = async (especialidadDto) => {
        const nuevo_id = await this.especialidadesDb.crear(especialidadDto);
        return this.buscarPorId(nuevo_id);
    }

    modificar = async (id, especialidadDto) => {
        const existe = await this.buscarPorId(id);
        if (!existe) return null;

        await this.especialidadesDb.modificar(id, especialidadDto);
        return this.buscarPorId(id);
    }

    borrar = async (id) => {
        const existe = await this.buscarPorId(id);
        if (!existe) return null;

        await this.especialidadesDb.borrar(id);
        return id;
    }
}