import pool from "./conexion.js";

export default class Medicos {

    buscarTodos = async () => {
        const sql = "SELECT * FROM medicos m INNER JOIN usuarios u ON m.id_usuario = u.id_usuario WHERE u.activo = 1";
        const [medicos] = await pool.query(sql);
        return medicos;
    }

    buscarPorId = async (id) => {
        const sql = "SELECT * FROM medicos m INNER JOIN usuarios u ON m.id_usuario = u.id_usuario WHERE u.activo = 1 AND m.id_medico = ?";
        const [medicos] = await pool.execute(sql, [id]);
        return medicos;
    }

    crear = async (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) => {
        const sql = "INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)";
        const [resultado] = await pool.execute(sql, [id_usuario, id_especialidad, matricula, descripcion, valor_consulta]);
        return resultado;
    }

    modificar = async (id, matricula, descripcion, valor_consulta) => {
        const sql = "UPDATE medicos SET matricula = ?, descripcion = ?, valor_consulta = ? WHERE id_medico = ?";
        const [resultado] = await pool.execute(sql, [id, matricula, descripcion, valor_consulta]);
        return resultado;
    }

    borrar = async (id_usuario) => {
        const sql = "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?";
        const [resultado] = await pool.execute(sql, [id_usuario]);
        return resultado;
    }
} 