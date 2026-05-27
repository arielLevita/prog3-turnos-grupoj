import ObrasSocialesDb from '../db/obrasSocialesDb.js';
import ObraSocialDto from '../dtos/obraSocialDto.js';

export default class ObrasSocialesServicio {
    constructor() {
        this.db = new ObrasSocialesDb();
    }

    buscarTodas = async (filters, limit, offset, order) => {
        // 1. Buscamos en la base de datos
        const obrasSocialesCrud = await this.db.buscarTodas(filters, limit, offset, order);
        
        // 2. Transformamos la lista cruda en una lista de DTOs limpios y la devolvemos
        return obrasSocialesCrud.map(os => new ObraSocialDto(os));
    }

    buscarPorId = async (id) => {
        const obraSocial = await this.db.buscarPorId(id);
        
        // Si no encontró nada, devolvemos null para que el Controlador lance un 404
        if (!obraSocial) return null;
        
        return new ObraSocialDto(obraSocial);
    }

    crear = async (obraSocialCreateDto) => {
        // Le pasamos el DTO de entrada (que ya viene limpio) directo a la base de datos
        return await this.db.crear(obraSocialCreateDto);
    }

    modificar = async (id, obraSocialCreateDto) => {
        // Verificamos si existe antes de modificar (opcional, pero buena práctica)
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        await this.db.modificar(id, obraSocialCreateDto);
        return id;
    }

    borrar = async (id) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        await this.db.borrar(id);
        return id;
    }
}