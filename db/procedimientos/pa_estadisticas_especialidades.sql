DELIMITER //

DROP PROCEDURE IF EXISTS pa_estadisticas_especialidades //

CREATE PROCEDURE pa_estadisticas_especialidades(IN fecha_desde DATE, IN fecha_hasta DATE)
BEGIN
    SELECT 
        e.nombre AS especialidad,
        COUNT(t.id_turno_reserva) AS total_turnos,
        SUM(CASE WHEN t.atendido = 1 THEN 1 ELSE 0 END) AS turnos_atendidos,
        SUM(CASE WHEN t.atendido = 0 THEN 1 ELSE 0 END) AS turnos_ausentes,
        COUNT(DISTINCT t.id_paciente) AS pacientes_atendidos
    FROM turnos_reservas t
    INNER JOIN medicos m ON t.id_medico = m.id_medico
    INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE t.activo = 1 
      AND DATE(t.fecha_hora) BETWEEN fecha_desde AND fecha_hasta
    GROUP BY e.id_especialidad, e.nombre
    ORDER BY total_turnos DESC;
END //

DELIMITER ;