import pool from "./conexion.js";

export default class MedicosObrasSociales {

    buscarTodos = async () => {
        const sql = "SELECT * FROM medicos_obras_sociales WHERE activo = 1";
        const [medicosObrasSociales] = await pool.query(sql);
        return medicosObrasSociales;
    }

    buscarPorId = async (id) => {
        const sql = "SELECT * FROM medicos_obras_sociales WHERE activo = 1 AND id_medico_obra_social = ?";
        const [medicosObrasSociales] = await pool.execute(sql, [id]);
        return medicosObrasSociales;
    }

    crear = async (id_medico, id_obra_social) => {
        const sql = "INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)";
        const [resultado] = await pool.execute(sql, [id_medico, id_obra_social]);
        return resultado;
    }

    modificar = async (id, id_medico, id_obra_social) => {
        const sql = "UPDATE medicos_obras_sociales SET id_medico = ?, id_obra_social = ? WHERE id_medico_obra_social = ?";
        const [resultado] = await pool.execute(sql, [id_medico, id_obra_social, id]);
        return resultado;
    }

    borrar = async (id_medico_obra_social) => {
        const sql = "UPDATE medicos_obras_sociales SET activo = 0 WHERE id_medico_obra_social = ?";
        const [resultado] = await pool.execute(sql, [id_medico_obra_social]);
        return resultado;
    }
} 