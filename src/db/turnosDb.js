import pool from "./conexion.js";

export default class TurnosDb {
    
    buscarTodas = async (filters = null, limit = 0, offset = 0, order = null) => {
        // Hacemos el triple JOIN para traer nombres en vez de IDs pelados
        let strSql = `SELECT t.id_turno_reserva, t.id_medico, t.id_paciente, t.id_obra_social, t.fecha_hora, t.valor_total, t.atentido,
                             CONCAT(vm.apellido, ' ', vm.nombres) AS medico_nombre,
                             CONCAT(vp.apellido, ' ', vp.nombres) AS paciente_nombre,
                             os.nombre AS obra_social_nombre
                      FROM turnos_reservas t
                      JOIN v_medicos vm ON t.id_medico = vm.id_medico
                      JOIN v_pacientes vp ON t.id_paciente = vp.id_paciente
                      JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
                      WHERE t.activo = 1 `;
        const filterValuesArray = [];

        if (filters) {
            strSql += "AND ";
            for (const clave of Object.keys(filters)) {
                // Especificamos t. para que MySQL no se confunda si la columna se repite
                strSql += `t.${clave} = ? AND `;
                filterValuesArray.push(filters[clave]);
            }
            strSql = strSql.substring(0, strSql.length - 5);
        }

        if (order) {
            for (const clave of Object.keys(order)) {
                strSql += ` ORDER BY t.${clave} ${order[clave]} `;
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
        const strSql = `SELECT t.id_turno_reserva, t.id_medico, t.id_paciente, t.id_obra_social, t.fecha_hora, t.valor_total, t.atentido,
                               CONCAT(vm.apellido, ' ', vm.nombres) AS medico_nombre,
                               CONCAT(vp.apellido, ' ', vp.nombres) AS paciente_nombre,
                               os.nombre AS obra_social_nombre
                        FROM turnos_reservas t
                        JOIN v_medicos vm ON t.id_medico = vm.id_medico
                        JOIN v_pacientes vp ON t.id_paciente = vp.id_paciente
                        JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
                        WHERE t.activo = 1 AND t.id_turno_reserva = ?`;
        const [rows] = await pool.execute(strSql, [id]);
        return (rows.length > 0) ? rows[0] : null;
    }

    // --- MAGIA DE TRANSACCIONES ---
    crear = async (turnoData, valorTotalCalculado) => {
        // 1. Pedimos una conexión dedicada al Pool
        const conexion = await pool.getConnection();
        
        try {
            // 2. Iniciamos la transacción manual
            await conexion.beginTransaction();

            const strSql = `INSERT INTO turnos_reservas 
                            (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido) 
                            VALUES (?, ?, ?, ?, ?, 0)`; // atentido arranca en 0 por defecto
            
            const [resultado] = await conexion.execute(strSql, [
                turnoData.idMedico, 
                turnoData.idPaciente, 
                turnoData.idObraSocial, 
                turnoData.fechaHora, 
                valorTotalCalculado
            ]);

            // 3. Si todo salió perfecto, confirmamos los cambios
            await conexion.commit();
            return resultado.insertId;

        } catch (error) {
            // 4. Si algo explotó, revertimos absolutamente todo
            await conexion.rollback();
            throw error; // Lanzamos el error para que el Controlador lo ataje
        } finally {
            // 5. Siempre, siempre liberamos la conexión
            conexion.release();
        }
    }

    // Para marcar un turno como "atendido" o cambiar de fecha
    modificar = async (id, camposUpdate, valoresUpdate) => {
        const strSql = `UPDATE turnos_reservas SET ${camposUpdate} WHERE id_turno_reserva = ?`;
        await pool.execute(strSql, [...valoresUpdate, id]);
        return id;
    }

    borrar = async (id) => {
        const strSql = "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?";
        await pool.execute(strSql, [id]);
    }
}