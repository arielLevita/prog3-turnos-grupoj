import pool from "./conexion.js";

export default class ObrasSocialesDb {
    
    // Lista todas las obras sociales con filtros, paginación y ordenamiento
    buscarTodas = async (filters = null, limit = 0, offset = 0, order = null) => {
        let strSql = `SELECT id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular 
                      FROM obras_sociales 
                      WHERE activo = 1 `;
        const filterValuesArray = [];

        if (filters) {
            strSql += "AND ";
            for (const clave of Object.keys(filters)) {
                // Si el filtro es un texto (nombre o descripcion), usamos LIKE
                if (clave === 'nombre' || clave === 'descripcion') {
                    strSql += `${clave} LIKE ? AND `;
                    filterValuesArray.push(`%${filters[clave]}%`);
                } else {
                    // Si es un número exacto (ej: es_particular = 1)
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

    // Busca una obra social específica
    buscarPorId = async (id) => {
        const strSql = `SELECT id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular 
                        FROM obras_sociales 
                        WHERE activo = 1 AND id_obra_social = ?`;
        const [rows] = await pool.execute(strSql, [id]);
        return (rows.length > 0) ? rows[0] : null;
    }

    // Inserta un nuevo registro
    crear = async ({ nombre, descripcion, porcentajeDescuento, esParticular }) => {
        const strSql = `INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) 
                        VALUES (?, ?, ?, ?)`;
        const [resultado] = await pool.execute(strSql, [nombre, descripcion, porcentajeDescuento, esParticular]);
        return resultado.insertId;
    }

    // Actualiza un registro existente
    modificar = async (id, { nombre, descripcion, porcentajeDescuento, esParticular }) => {
        const strSql = `UPDATE obras_sociales 
                        SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? 
                        WHERE id_obra_social = ?`;
        await pool.execute(strSql, [nombre, descripcion, porcentajeDescuento, esParticular, id]);
        return id;
    }

    // Soft Delete (Borrado Lógico)
    borrar = async (id) => {
        const strSql = "UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?";
        await pool.execute(strSql, [id]);
    }
}