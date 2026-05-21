import Usuarios from "../db/usuariosDb.js";

export default class UsuariosServicio {
    constructor() {
        this.usuarios = new Usuarios();
    }

    buscarTodos = async () => {
        return await this.usuarios.buscarTodos();
    }

    buscarPorId = async (id) => {
        return await this.usuarios.buscarPorId(id);
    }

    crear = async (nombres, apellido, documento, email, contrasenia, rol, foto) => {
        return await this.usuarios.crear(nombres, apellido, documento, email, contrasenia, rol, foto);
    }

    modificar = async (id, nombres) => {
        return await this.usuarios.modificar(id, nombres);
    }

    borrar = async (id) => {
        return await this.usuarios.borrar(id);
    }
} 