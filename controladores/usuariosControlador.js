import UsuariosServicio from "../servicios/usuariosServicio.js";

export default class UsuariosControlador {
    constructor() {
        this.usuarios = new UsuariosServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const usuarios = await this.usuarios.buscarTodos();

            if (usuarios.length === 0) {
                return res.status(404).json({ estado: false, msg: 'No hay usuarios registrados' });
            }

            res.status(200).json(usuarios);
        } catch (error) {
            console.log(`Error en GET /usuarios ${error}`);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_usuario;
            const usuario = await this.usuarios.buscarPorId(id);

            if (usuario.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Usuario no encontrado' });
            }

            res.status(200).json(usuario);
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const { nombres, apellido, documento, email, contrasenia, rol, foto } = req.body;
            const resultado = await this.usuarios.crear(nombres, apellido, documento, email, contrasenia, rol, foto);

            if (resultado.affectedRows > 0) {
                res.status(201).json({ estado: true, msg: `ID Creado ${resultado.insertId}` });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'El usuario ya existe' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_usuario;

            const existe = await this.usuarios.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Usuario no encontrado' });
            }

            const { nombres } = req.body;
            const resultado = await this.usuarios.modificar(id, nombres);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Usuario modificado' });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ estado: false, msg: 'Ese nombre de usuario ya está en uso' });
            }
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_usuario;

            const existe = await this.usuarios.buscarPorId(id);
            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Usuario no encontrado' });
            }

            const resultado = await this.usuarios.borrar(id);

            if (resultado.affectedRows > 0) {
                res.status(200).json({ estado: true, msg: 'Usuario eliminado' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, msg: 'Error interno del servidor' });
        }
    }
} 