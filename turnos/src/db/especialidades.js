import pool from "./conexion.js";

// Esta clase es la ÚNICA que habla en SQL. No le importan los errores HTTP ni req/res.
export default class Especialidades {
    
    buscarTodas = async () => {
        const sql = "SELECT * FROM especialidades WHERE activo = 1";
        const [especialidades] = await pool.query(sql);
        return especialidades;
    }

    buscarPorId = async (id) => {
        const sql = "SELECT * FROM especialidades WHERE activo = 1 AND id_especialidad = ?";
        // Usamos execute porque le inyectamos el [id]
        const [especialidades] = await pool.execute(sql, [id]);
        return especialidades; 
    }

    crear = async (nombre) => {
        const sql = "INSERT INTO especialidades (nombre) VALUES (?)";
        const [resultado] = await pool.execute(sql, [nombre]);
        return resultado;
    }

    modificar = async (id, nombre) => {
        const sql = "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?";
        const [resultado] = await pool.execute(sql, [nombre, id]);
        return resultado;
    }

    borrar = async (id) => {
        const sql = "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?";
        const [resultado] = await pool.execute(sql, [id]);
        return resultado;
    }
}