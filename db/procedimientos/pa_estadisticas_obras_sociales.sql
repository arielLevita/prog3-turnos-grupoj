DELIMITER //

CREATE PROCEDURE pa_estadisticas_obras_sociales(IN fecha_desde DATE, IN fecha_hasta DATE)
BEGIN
    SELECT 
        os.nombre AS obra_social,
        COUNT(t.id_turno_reserva) AS total_turnos,
        SUM(CASE WHEN t.atendido = 1 THEN 1 ELSE 0 END) AS turnos_atendidos,
        SUM(CASE WHEN t.atendido = 0 THEN 1 ELSE 0 END) AS turnos_ausentes,
        COUNT(DISTINCT t.id_paciente) AS pacientes_distintos
    FROM turnos_reservas t
    INNER JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
    WHERE t.activo = 1 AND os.activo = 1
      AND DATE(t.fecha_hora) BETWEEN fecha_desde AND fecha_hasta
    GROUP BY os.id_obra_social, os.nombre
    ORDER BY total_turnos DESC;
END //

DELIMITER ;