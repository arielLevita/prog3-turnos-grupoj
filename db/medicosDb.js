import pool from "./conexion.js";

export default class MedicosDb {
    
    buscarTodas = async (filters = null, limit = 0, offset = 0, order = null) => {
        let strSql = `SELECT v.id_medico, v.id_usuario, v.apellido, v.nombres, v.email,
                             m.matricula, m.descripcion, m.valor_consulta,
                             m.id_especialidad, e.nombre as especialidad_nombre
                      FROM v_medicos v
                      JOIN medicos m ON v.id_medico = m.id_medico
                      JOIN especialidades e ON m.id_especialidad = e.id_especialidad 
                      WHERE 1=1 `; // 1=1 es un truco para poder concatenar los AND más fácil
        const filterValuesArray = [];

        if (filters) {
            strSql += "AND ";
            for (const clave of Object.keys(filters)) {
                if (clave === 'apellido' || clave === 'nombres' || clave === 'especialidad_nombre') {
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
        const strSql = `SELECT v.id_medico, v.id_usuario, v.apellido, v.nombres, v.email,
                               m.matricula, m.descripcion, m.valor_consulta,
                               m.id_especialidad, e.nombre as especialidad_nombre
                        FROM v_medicos v
                        JOIN medicos m ON v.id_medico = m.id_medico
                        JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                        WHERE v.id_medico = ?`;
        const [rows] = await pool.execute(strSql, [id]);
        return (rows.length > 0) ? rows[0] : null;
    }

    crear = async ({ idUsuario, idEspecialidad, matricula, descripcion, valorConsulta }) => {
        const strSql = `INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) 
                        VALUES (?, ?, ?, ?, ?)`;
        const [resultado] = await pool.execute(strSql, [idUsuario, idEspecialidad, matricula, descripcion, valorConsulta]);
        return resultado.insertId;
    }

    modificar = async (id, { idUsuario, idEspecialidad, matricula, descripcion, valorConsulta }) => {
        const strSql = `UPDATE medicos 
                        SET id_usuario = ?, id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ? 
                        WHERE id_medico = ?`;
        await pool.execute(strSql, [idUsuario, idEspecialidad, matricula, descripcion, valorConsulta, id]);
        return id;
    }


    buscarRelacion = async (id_medico, id_obra_social) => {
        const sql = `SELECT * FROM medicos_obras_sociales WHERE id_medico = ? AND id_obra_social = ? AND activo = 1`;
    
        const [rows] = await pool.execute(sql, [id_medico, id_obra_social]);
        return rows;
    }

    // ============================================================================
    // 📍 Métodos Auxiliares para la Relación Médico - Obra Social
    // ============================================================================
    
    // Busca los IDs de las obras sociales que YA tiene asignadas este médico
    buscarAsociacionesPorMedico = async (id_medico) => {
        const strSql = `SELECT id_obra_social 
                        FROM medicos_obras_sociales 
                        WHERE id_medico = ? AND activo = 1`;
        const [rows] = await pool.query(strSql, [id_medico]);
        // Convertimos el array de objetos en un array simple de números: [1, 2, 4]
        return rows.map(row => row.id_obra_social);
    }

    // Transacción que inserta las asociaciones
    asociarMultiples = async (id_medico, obras_sociales_ids) => {
        const conexion = await pool.getConnection();
        try {
            await conexion.beginTransaction();

            for (const id_obra_social of obras_sociales_ids) {
                const sql = `INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?);`
                await conexion.execute(sql, [id_medico, id_obra_social]);
            }

            await conexion.commit();
            return true;
        } catch (error) {
            await conexion.rollback();
            console.error("Error en transacción asociarMultiples:", error);
            // 'throw error' avisa hacia arriba (al Controlador) que algo falló, para que no devuelva un "200 OK" falso.
            throw error; 
        } finally {
            // El 'finally' se ejecuta SIEMPRE (haya fallado o no). Es VITAL para devolver la conexión al pool
            // y evitar que la base de datos colapse por conexiones atascadas.
            conexion.release();
        }
    }

    // Desactiva (Soft Delete) una asociación específica entre un médico y una obra social
    desasociarObraSocial = async (id_medico, id_obra_social) => {
        const strSql = `UPDATE medicos_obras_sociales 
                        SET activo = 0 
                        WHERE id_medico = ? AND id_obra_social = ?`;
        await pool.execute(strSql, [id_medico, id_obra_social]);
        return true;
    }

    borrar = async (id) => {
        const strSql = `UPDATE usuarios 
                        SET activo = 0 
                        WHERE id_usuario = (SELECT id_usuario FROM medicos WHERE id_medico = ?)`;
        await pool.execute(strSql, [id]);
    }
}



