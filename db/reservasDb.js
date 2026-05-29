import pool from "./conexion.js";

export default class Reservas {

    buscarTurnosPropiosPaciente = async (id) => {
        const sql = "SELECT * FROM turnos_reservas WHERE activo = 1 AND id_paciente = ?";
        const [reservas] = await pool.query(sql, [id]);
        return reservas;
    }

    buscarTurnosPropiosMedicos = async (id) => {
        const sql = "SELECT * FROM turnos_reservas WHERE activo = 1 AND id_medico = ?";
        const [reservas] = await pool.query(sql, [id]);
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

    modificar = async (id, fecha_hora, atentido) => {
        const sql = "UPDATE turnos_reservas SET fecha_hora = ?, valor_total = ?, atentido = ? WHERE id_turno_reserva = ?";
        const [resultado] = await pool.execute(sql, [fecha_hora, atentido, id]);
        return resultado;
    }

    marcarAtendido = async (id, atentido) => {
        const sql = "UPDATE turnos_reservas SET atentido = ? WHERE id_turno_reserva = ?";
        const [resultado] = await pool.execute(sql, [atentido, id]);
        return resultado;
    }

    borrar = async (id) => {
        const sql = "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?";
        const [resultado] = await pool.execute(sql, [id]);
        return resultado;
    }
} 