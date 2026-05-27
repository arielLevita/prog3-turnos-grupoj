import EspecialidadesDb from "../db/especialidadesDb.js";
import EspecialidadResponseDto from "../dtos/especialidadResponseDto.js";

// El servicio coordina. Instancia la base de datos y llama a sus métodos.
export default class EspecialidadesServicio {
    // 1. DICCIONARIO: Traduce lo que pide el Frontend a columnas reales de MySQL
    static KEYS_MAP = {
        idEspecialidad: 'id_especialidad',
        nombre: 'nombre'
    };

    // 2. TRADUCTOR AUTOMÁTICO: Recibe un objeto y le cambia las claves usando el diccionario
    static mapKeysToColumns = (obj) => {
        // Si no hay filtros, salimos rápido
        if (obj === undefined || obj === null || Object.keys(obj).length === 0) return null;
        
        // reduce() arma un objeto nuevo. Si el Frontend mandó { idEspecialidad: 1 }, 
        // lo transforma mágicamente a { id_especialidad: 1 }
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
        // Pasamos los filtros por el traductor automático antes de mandarlos a la BD
        const sqlFilter = EspecialidadesServicio.mapKeysToColumns(filter);
        const sqlOrder = EspecialidadesServicio.mapKeysToColumns(order);

        // Pedimos los datos a MySQL
        const tableResults = await this.especialidadesDb.buscarTodas(sqlFilter, limit, offset, sqlOrder);
        
        // map() recorre la lista y pasa cada fila por el ResponseDTO para dejarla linda
        return tableResults.map(row => new EspecialidadResponseDto(row));
    }

    buscarPorId = async (id) => {
        const row = await this.especialidadesDb.buscarPorId(id);
        if (!row) return null;
        // Si existe, la pasamos por el DTO para limpiarla
        return new EspecialidadResponseDto(row);
    }

    crear = async (especialidadDto) => {
        return await this.especialidadesDb.crear(especialidadDto);
    }

    modificar = async (id, especialidadDto) => {
        return await this.especialidadesDb.modificar(id, especialidadDto);
    }

    borrar = async (id) => {
        await this.especialidadesDb.borrar(id);
    }
}