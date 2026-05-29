import pool from "./conexion.js";

export default class Pacientes {

    buscarTodos = async () => {
        const sql = "SELECT * FROM pacientes";
        const [pacientes] = await pool.query(sql);
        return pacientes;
    }

    buscarPorId = async (id) => {
        const sql = "SELECT * FROM pacientes WHERE id_paciente = ?";
        const [pacientes] = await pool.execute(sql, [id]);
        return pacientes;
    }

    crear = async (id_usuario, id_obra_social) => {
        const sql = "INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)";
        const [resultado] = await pool.execute(sql, [id_usuario, id_obra_social]);
        return resultado;
    }

    modificar = async (id, id_usuario, id_obra_social) => {
        const sql = "UPDATE pacientes SET id_usuario = ?, id_obra_social = ? WHERE id_paciente = ?";
        const [resultado] = await pool.execute(sql, [id_usuario, id_obra_social, id]);
        return resultado;
    }

    borrar = async (id_usuario) => {
        const sql = "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?";
        const [resultado] = await pool.execute(sql, [id_usuario]);
        return resultado;
    }
} 