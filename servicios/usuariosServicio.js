import UsuariosDb from '../db/usuariosDb.js';
import UsuarioResponseDto from '../dtos/usuarioResponseDto.js';

export default class UsuariosServicio {
    constructor() {
        this.db = new UsuariosDb();
    }

    buscarTodas = async (filters, limit, offset, order) => {
        const usuariosCrud = await this.db.buscarTodas(filters, limit, offset, order);
        return usuariosCrud.map(usuario => new UsuarioResponseDto(usuario));
    }

    buscarPorId = async (id) => {
        const usuario = await this.db.buscarPorId(id);
        if (!usuario) return null;
        return new UsuarioResponseDto(usuario);
    }

    buscar = async (email, contrasenia) => {
        return await this.db.buscar(email, contrasenia);
    }

    crear = async (usuarioCreateDto) => {
        return await this.db.crear(usuarioCreateDto);
    }

    modificar = async (id, usuarioCreateDto) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        await this.db.modificar(id, usuarioCreateDto);
        return id;
    }

    borrar = async (id) => {
        const existe = await this.db.buscarPorId(id);
        if (!existe) return null;

        await this.db.borrar(id);
        return id;
    }
}