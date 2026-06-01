import pool from "./conexion.js";

export default class ObrasSocialesDb {
    buscarTodas = async (filters = null, limit = 0, offset = 0, order = null) => {
        let strSql = `SELECT id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular 
                      FROM obras_sociales 
                      WHERE activo = 1 `;
        const filterValuesArray = [];

        if (filters) {
            strSql += "AND ";
            for (const clave of Object.keys(filters)) {
                if (clave === 'nombre' || clave === 'descripcion') {
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
        const strSql = `SELECT id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular 
                        FROM obras_sociales 
                        WHERE activo = 1 AND id_obra_social = ?`;
        const [rows] = await pool.execute(strSql, [id]);
        return (rows.length > 0) ? rows[0] : null;
    }
    crear = async ({ nombre, descripcion, porcentajeDescuento, esParticular }) => {
        const strSql = `INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) 
                        VALUES (?, ?, ?, ?)`;
        const [resultado] = await pool.execute(strSql, [nombre, descripcion, porcentajeDescuento, esParticular]);
        return resultado.insertId;
    }

    modificar = async (id, { nombre, descripcion, porcentajeDescuento, esParticular }) => {
        const strSql = `UPDATE obras_sociales 
                        SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? 
                        WHERE id_obra_social = ?`;
        await pool.execute(strSql, [nombre, descripcion, porcentajeDescuento, esParticular, id]);
        return id;
    }

    borrar = async (id) => {
        const strSql = "UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?";
        await pool.execute(strSql, [id]);
    }
}