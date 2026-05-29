import pool from "./conexion.js";

export default class PacientesDb {
    
    // Lista todos los pacientes usando la vista para traer datos completos de la persona
    buscarTodas = async (filters = null, limit = 0, offset = 0, order = null) => {
        let strSql = `SELECT id_paciente, id_usuario, id_obra_social, apellido, nombres, email, descripcion_obra_social, foto_path 
                      FROM v_pacientes 
                      WHERE 1=1 `;
        const filterValuesArray = [];

        if (filters) {
            strSql += "AND ";
            for (const clave of Object.keys(filters)) {
                if (clave === 'apellido' || clave === 'nombres' || clave === 'email') {
                    strSql += `${clave} LIKE ? AND `;
                    filterValuesArray.push(`%${filters[clave]}%`);
                } else {
                    strSql += `${clave} = ? AND `;
                    filterValuesArray.push(filters[clave]);
                }
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

    // Busca un paciente específico a través de la vista
    buscarPorId = async (id) => {
        const strSql = `SELECT id_paciente, id_usuario, id_obra_social, apellido, nombres, email, descripcion_obra_social, foto_path 
                        FROM v_pacientes 
                        WHERE id_paciente = ?`;
        const [rows] = await pool.execute(strSql, [id]);
        return (rows.length > 0) ? rows[0] : null;
    }

    // Inserta una nueva relación en la tabla física
    crear = async ({ idUsuario, idObraSocial }) => {
        const strSql = `INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)`;
        const [resultado] = await pool.execute(strSql, [idUsuario, idObraSocial]);
        return resultado.insertId;
    }

    // Actualiza la obra social o el usuario vinculado
    modificar = async (id, { idUsuario, idObraSocial }) => {
        const strSql = `UPDATE pacientes SET id_usuario = ?, id_obra_social = ? WHERE id_paciente = ?`;
        await pool.execute(strSql, [idUsuario, idObraSocial, id]);
        return id;
    }

    // Soft Delete: Desactiva el registro de la tabla usuarios para mantener integridad de la vista
    borrar = async (id) => {
        const strSql = `UPDATE usuarios 
                        SET activo = 0 
                        WHERE id_usuario = (SELECT id_usuario FROM pacientes WHERE id_paciente = ?)`;
        await pool.execute(strSql, [id]);
    }
}