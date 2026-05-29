import pool from "./conexion.js";

export default class Especialidades {

    buscarTodas = async (filters = null, limit = 0, offset = 0, order = null) => {
        let strSql = `SELECT id_especialidad, nombre FROM especialidades WHERE activo = 1 `;
        const filterValuesArray = [];

        if (filters) {
            strSql += "AND "; 
            for (const clave of Object.keys(filters)) {
                strSql += `${clave} LIKE ? AND `;
                filterValuesArray.push(`%${filters[clave]}%`);
            }
            strSql = strSql.substring(0, strSql.length - 5);
        }

        if (order) {
            for (const clave of Object.keys(order)) {
                strSql += ` ORDER BY ${clave} ${order[clave]} `;
            }
        }

        if (limit) {
            strSql += 'LIMIT ? OFFSET ? ';
            filterValuesArray.push(limit, offset);
        }

        const [rows] = await pool.query(strSql, filterValuesArray);
        return rows; 
    }

    buscarPorId = async (id) => {
        const strSql = "SELECT id_especialidad, nombre FROM especialidades WHERE activo = 1 AND id_especialidad = ?";
        const [rows] = await pool.execute(strSql, [id]);
        
        return (rows.length > 0) ? rows[0] : null;
    }

    crear = async ({ nombre }) => {
        const strSql = "INSERT INTO especialidades (nombre) VALUES (?)";
        const [resultado] = await pool.execute(strSql, [nombre]);
        return resultado.insertId; 
    }

    modificar = async (id, { nombre }) => {
        const strSql = "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?";
        await pool.execute(strSql, [nombre, id]);
        return id;
    }

    borrar = async (id) => {
        const strSql = "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?";
        await pool.execute(strSql, [id]);
    }
}