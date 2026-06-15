-- SCRIPT DE ESTADÍSTICAS - Nota: Se garantiza consistencia usando la columna 'atentido'

DROP PROCEDURE IF EXISTS pa_estadisticas_especialidades;
DROP PROCEDURE IF EXISTS pa_estadisticas_obras_sociales;
DROP PROCEDURE IF EXISTS pa_estadisticas_medicos;

DELIMITER //

CREATE PROCEDURE pa_estadisticas_especialidades(IN fecha_desde DATE, IN fecha_hasta DATE)
BEGIN
    SELECT 
        e.nombre AS especialidad,
        COUNT(t.id_turno_reserva) AS total_turnos,
        SUM(CASE WHEN t.atentido = 1 THEN 1 ELSE 0 END) AS turnos_atendidos,
        SUM(CASE WHEN t.atentido = 0 THEN 1 ELSE 0 END) AS turnos_ausentes,
        COUNT(DISTINCT t.id_paciente) AS pacientes_atendidos
    FROM turnos_reservas t
    INNER JOIN medicos m ON t.id_medico = m.id_medico
    INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE t.activo = 1 
      AND DATE(t.fecha_hora) BETWEEN fecha_desde AND fecha_hasta
    GROUP BY e.id_especialidad, e.nombre
    ORDER BY total_turnos DESC;
END //

CREATE PROCEDURE pa_estadisticas_obras_sociales(IN fecha_desde DATE, IN fecha_hasta DATE)
BEGIN
    SELECT 
        os.nombre AS obra_social,
        COUNT(t.id_turno_reserva) AS total_turnos,
        SUM(CASE WHEN t.atentido = 1 THEN 1 ELSE 0 END) AS turnos_atendidos,
        SUM(CASE WHEN t.atentido = 0 THEN 1 ELSE 0 END) AS turnos_ausentes,
        COUNT(DISTINCT t.id_paciente) AS pacientes_distintos
    FROM turnos_reservas t
    INNER JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
    WHERE t.activo = 1 AND os.activo = 1 
      AND DATE(t.fecha_hora) BETWEEN fecha_desde AND fecha_hasta
    GROUP BY os.id_obra_social, os.nombre
    ORDER BY total_turnos DESC;
END //

CREATE PROCEDURE pa_estadisticas_medicos(IN fecha_desde DATE, IN fecha_hasta DATE)
BEGIN
    SELECT 
        CONCAT(u.apellido, ', ', u.nombres) AS medico,
        e.nombre AS especialidad,
        COUNT(t.id_turno_reserva) AS total_turnos,
        SUM(CASE WHEN t.atentido = 1 THEN 1 ELSE 0 END) AS turnos_atendidos,
        SUM(CASE WHEN t.atentido = 0 THEN 1 ELSE 0 END) AS turnos_ausentes,
        COUNT(DISTINCT t.id_paciente) AS pacientes_atendidos
    FROM turnos_reservas t
    INNER JOIN medicos m ON t.id_medico = m.id_medico
    INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
    INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE t.activo = 1 
      AND DATE(t.fecha_hora) BETWEEN fecha_desde AND fecha_hasta
    GROUP BY m.id_medico, u.apellido, u.nombres, e.nombre
    ORDER BY total_turnos DESC;
END //

DELIMITER ;