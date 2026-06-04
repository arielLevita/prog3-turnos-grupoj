import pool from "./conexion.js";

export default class UsuariosDb {
    
    buscarTodas = async (filters = null, limit = 0, offset = 0, order = null) => {
        let strSql = `SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol 
                      FROM usuarios 
                      WHERE activo = 1 `;
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

    buscarPorId = async (id) => {
        const strSql = `SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol 
                        FROM usuarios 
                        WHERE activo = 1 AND id_usuario = ?`;
        const [rows] = await pool.execute(strSql, [id]);
        return (rows.length > 0) ? rows[0] : null;
    }

    buscar = async (email, contrasenia) => {
        const strSql = `SELECT u.id_usuario, CONCAT(u.nombres, ' ', u.apellido) as usuario, u.rol 
                        FROM usuarios AS u
                        WHERE u.email = ? AND u.contrasenia = SHA2(?, 256) AND u.activo = 1`;
        const [rows] = await pool.execute(strSql, [email, contrasenia]);
        return (rows.length > 0) ? rows[0] : null;
    }

    crear = async ({ documento, apellido, nombres, email, contrasenia, fotoPath, rol }) => {
        const strSql = `INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [resultado] = await pool.execute(strSql, [documento, apellido, nombres, email, contrasenia, fotoPath, rol]);
        return resultado.insertId;
    }

    modificar = async (id, { documento, apellido, nombres, email, contrasenia, fotoPath, rol }) => {

        let strSql = "";
        let values = [];

        if (contrasenia) {
            strSql = `UPDATE usuarios 
                      SET documento = ?, apellido = ?, nombres = ?, email = ?, contrasenia = ?, foto_path = ?, rol = ? 
                      WHERE id_usuario = ?`;
            values = [documento, apellido, nombres, email, contrasenia, fotoPath, rol, id];
        } else {
            strSql = `UPDATE usuarios 
                      SET documento = ?, apellido = ?, nombres = ?, email = ?, foto_path = ?, rol = ? 
                      WHERE id_usuario = ?`;
            values = [documento, apellido, nombres, email, fotoPath, rol, id];
        }
        
        await pool.execute(strSql, values);
        return id;
    }

    borrar = async (id) => {
        const strSql = "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?";
        await pool.execute(strSql, [id]);
    }
}