import UsuariosServicio from '../servicios/usuariosServicio.js';

export default class UsuariosControlador {
    constructor() {
        this.servicio = new UsuariosServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const { filter, limit, offset, order } = req.query;
            const usuarios = await this.servicio.buscarTodas(filter, limit, offset, order);
            res.status(200).json(usuarios);
        } catch (error) {
            console.error("Error en buscarTodas (Usuarios):", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id_usuario;
            const usuario = await this.servicio.buscarPorId(id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.status(200).json(usuario);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    crear = async (req, res) => {
        try {
            const idGenerado = await this.servicio.crear(req.dto);
            res.status(201).json({ estado: true, msg: `Usuario creado con ID ${idGenerado}` });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'El documento o email ya se encuentra registrado' });
            }
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.id_usuario;
            const idModificado = await this.servicio.modificar(id, req.dto);
            
            if (!idModificado) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.status(200).json({ estado: true, msg: 'Usuario modificado con éxito' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'El documento o email ya se encuentra registrado' });
            }
            res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        }
    }

    borrar = async (req, res) => {
        try {
            const id = req.params.id_usuario;
            const idBorrado = await this.servicio.borrar(id);
            if (!idBorrado) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.status(200).json({ estado: true, msg: 'Usuario eliminado (Soft Delete)' });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}