import pool from "./conexion.js";

export default class MedicosDb {
    
    buscarTodas = async (filters = null, limit = 0, offset = 0, order = null) => {
        // Hacemos JOIN de la vista v_medicos con la tabla medicos y especialidades
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

    borrar = async (id) => {
        // Truco maestro: Para "borrar" al médico, buscamos su id_usuario y lo desactivamos
        const strSql = `UPDATE usuarios 
                        SET activo = 0 
                        WHERE id_usuario = (SELECT id_usuario FROM medicos WHERE id_medico = ?)`;
        await pool.execute(strSql, [id]);
    }
}