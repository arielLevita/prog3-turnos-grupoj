import pool from "./conexion.js";

export default class Reservas {

    buscarTodos = async () => {
        const sql = "SELECT * FROM turnos_reservas WHERE activo = 1";
        const [reservas] = await pool.query(sql);
        return reservas;
    }

    buscarPorId = async (id) => {
        const sql = "SELECT * FROM turnos_reservas WHERE activo = 1 AND id_turno_reserva = ?";
        const [reservas] = await pool.execute(sql, [id]);
        return reservas;
    }

    crear = async (id_medico,id_paciente, id_obra_social, fecha_hora, valor_total, atentido) => {
        const sql = "INSERT INTO turnos_reservas (id_medico,id_paciente, id_obra_social, fecha_hora, valor_total, atentido) VALUES (?, ?, ?, ?, ?, ?)";
        const [resultado] = await pool.execute(sql, [id_medico,id_paciente, id_obra_social, fecha_hora, valor_total, atentido]);
        return resultado;
    }

    modificar = async (id, fecha_hora, valor_total, atentido) => {
        const sql = "UPDATE turnos_reservas SET fecha_hora = ?, valor_total = ?, atentido = ? WHERE id_turno_reserva = ?";
        const [resultado] = await pool.execute(sql, [fecha_hora, valor_total, atentido, id]);
        return resultado;
    }

    borrar = async (id) => {
        const sql = "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?";
        const [resultado] = await pool.execute(sql, [id]);
        return resultado;
    }
} 