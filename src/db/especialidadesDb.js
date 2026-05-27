import pool from "./conexion.js";

// Esta clase es la ÚNICA que habla en SQL. No le importan los errores HTTP ni req/res.
export default class EspecialidadesDb {
 
    buscarTodas = async (filters = null, limit = 0, offset = 0, order = null) => {
        // Usamos 'let' porque vamos a ir agregándole texto a esta variable base
        let strSql = `SELECT id_especialidad, nombre FROM especialidades WHERE activo = 1 `;
        
        // Array para guardar los valores que reemplazarán a los signos de interrogación (?)
        const filterValuesArray = [];

        // Si el usuario mandó filtros (ej: nombre=PEDIATRIA)
        if (filters) {
            strSql += "AND "; // Agregamos AND a la consulta base
            for (const clave of Object.keys(filters)) {
                // Usamos LIKE para que encuentre coincidencias parciales (ej: "PEDI" encuentra "PEDIATRIA")
                strSql += `${clave} LIKE ? AND `;
                filterValuesArray.push(`%${filters[clave]}%`);
            }
            // Borramos los últimos 5 caracteres (" AND ") que sobran al final del bucle
            strSql = strSql.substring(0, strSql.length - 5);
        }

        // Si el usuario pidió ordenar los resultados
        if (order) {
            for (const clave of Object.keys(order)) {
                // clave es la columna (ej: nombre) y order[clave] es la dirección (ASC o DESC)
                strSql += ` ORDER BY ${clave} ${order[clave]} `;
            }
        }

        // Si el usuario pidió paginación (limitar cantidad de resultados)
        if (limit) {
            strSql += 'LIMIT ? OFFSET ? ';
            filterValuesArray.push(limit, offset);
        }

        // Ejecutamos la consulta pasándole el texto armado y los valores
        const [rows] = await pool.query(strSql, filterValuesArray);
        return rows; // Retornamos la lista completa
    }

    buscarPorId = async (id) => {
        const strSql = "SELECT id_especialidad, nombre FROM especialidades WHERE activo = 1 AND id_especialidad = ?";
        const [rows] = await pool.execute(strSql, [id]);
        
        // Si el array tiene algo, devolvemos el primer elemento (rows[0]). Si no, devolvemos null.
        return (rows.length > 0) ? rows[0] : null;
    }

    crear = async ({ nombre }) => {
        const strSql = "INSERT INTO especialidades (nombre) VALUES (?)";
        const [resultado] = await pool.execute(strSql, [nombre]);
        return resultado.insertId; // Retornamos el ID autoincremental que generó MySQL
    }

    modificar = async (id, { nombre }) => {
        const strSql = "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?";
        await pool.execute(strSql, [nombre, id]);
        return id;
    }

    borrar = async (id) => {
        // Borrado lógico: no eliminamos la fila, solo la marcamos como inactiva (0)
        const strSql = "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?";
        await pool.execute(strSql, [id]);
    }
}