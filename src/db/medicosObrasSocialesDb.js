import pool from "./conexion.js";

export default class MedicosObrasSocialesDb {
    
    buscarTodas = async (filters = null, limit = 0, offset = 0, order = null) => {
        let strSql = `SELECT mos.id_medico_obra_social, mos.id_medico, mos.id_obra_social,
                             CONCAT(vm.apellido, ' ', vm.nombres) as medico_nombre,
                             os.nombre as obra_social_nombre
                      FROM medicos_obras_sociales mos
                      JOIN v_medicos vm ON mos.id_medico = vm.id_medico
                      JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
                      WHERE mos.activo = 1 `;
        const filterValuesArray = [];

        if (filters) {
            strSql += "AND ";
            for (const clave of Object.keys(filters)) {
                // Filtramos específicamente por el ID de la tabla intermedia
                strSql += `mos.${clave} = ? AND `;
                filterValuesArray.push(filters[clave]);
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
        const strSql = `SELECT mos.id_medico_obra_social, mos.id_medico, mos.id_obra_social,
                               CONCAT(vm.apellido, ' ', vm.nombres) as medico_nombre,
                               os.nombre as obra_social_nombre
                        FROM medicos_obras_sociales mos
                        JOIN v_medicos vm ON mos.id_medico = vm.id_medico
                        JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
                        WHERE mos.activo = 1 AND mos.id_medico_obra_social = ?`;
        const [rows] = await pool.execute(strSql, [id]);
        return (rows.length > 0) ? rows[0] : null;
    }

    crear = async ({ idMedico, idObraSocial }) => {
        const strSql = `INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)`;
        const [resultado] = await pool.execute(strSql, [idMedico, idObraSocial]);
        return resultado.insertId;
    }

    modificar = async (id, { idMedico, idObraSocial }) => {
        const strSql = `UPDATE medicos_obras_sociales SET id_medico = ?, id_obra_social = ? WHERE id_medico_obra_social = ?`;
        await pool.execute(strSql, [idMedico, idObraSocial, id]);
        return id;
    }

    borrar = async (id) => {
        const strSql = "UPDATE medicos_obras_sociales SET activo = 0 WHERE id_medico_obra_social = ?";
        await pool.execute(strSql, [id]);
    }
}