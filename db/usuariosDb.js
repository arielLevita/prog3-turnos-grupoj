import pool from "./conexion.js";

export default class Usuarios {

    buscarTodos = async () => {
        const sql = "SELECT * FROM usuarios WHERE activo = 1";
        const [usuarios] = await pool.query(sql);
        return usuarios;
    }

    buscarPorId = async (id) => {
        const sql = "SELECT * FROM usuarios WHERE activo = 1 AND id_usuario = ?";
        const [usuarios] = await pool.execute(sql, [id]);
        return usuarios;
    }

    crear = async (nombres, apellido, documento, email, contrasenia, rol, foto) => {
        const sql = "INSERT INTO usuarios (nombres, apellido, documento, email, contrasenia, rol, foto_path) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const [resultado] = await pool.execute(sql, [nombres, apellido, documento, email, contrasenia, rol, foto]);
        return resultado;
    }

    modificar = async (id, nombre) => {
        const sql = "UPDATE usuarios SET nombre = ? WHERE id_usuario = ?";
        const [resultado] = await pool.execute(sql, [nombre, id]);
        return resultado;
    }

    borrar = async (id) => {
        const sql = "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?";
        const [resultado] = await pool.execute(sql, [id]);
        return resultado;
    }
} 