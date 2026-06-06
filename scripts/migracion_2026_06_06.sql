-- Migración: Corrección de error de tipeo en tabla turnos_reservas
-- Fecha: 2026-06-06
-- Autor: Walter Cuesta
-- Descripción: Cambia columna 'atentido' por 'atendido' para corregir error en queries.

ALTER TABLE turnos_reservas 
CHANGE COLUMN atentido atendido TINYINT NOT NULL DEFAULT 0;