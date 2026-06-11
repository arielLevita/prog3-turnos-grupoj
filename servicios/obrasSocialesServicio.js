import ObrasSocialesDb from '../db/obrasSocialesDb.js';
import ObraSocialDto from '../dtos/obraSocialDto.js';
import apicache from "apicache"

export default class ObrasSocialesServicio {
    constructor() {
        this.db = new ObrasSocialesDb();
    }

    buscarTodas = async (filters, limit, offset, order) => {
        const obrasSocialesCrud = await this.db.buscarTodas(filters, limit, offset, order);
        
        return obrasSocialesCrud.map(os => new ObraSocialDto(os));
    }

    buscarPorId = async (id) => {
        const obraSocial = await this.db.buscarPorId(id);
        
        if (!obraSocial) return null;
        
        return new ObraSocialDto(obraSocial);
    }

    crear = async (obraSocialCreateDto) => {

        apicache.clear()
        return await this.db.crear(obraSocialCreateDto);
    }

    modificar = async (id, obraSocialCreateDto) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        await this.db.modificar(id, obraSocialCreateDto);

        apicache.clear()
        return id;
    }

    borrar = async (id) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        await this.db.borrar(id);

        apicache.clear()
        return id;
    }
}