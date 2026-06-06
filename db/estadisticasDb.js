import pool from "./conexion.js";

export default class Estadisticas {
  porObraSocial = async (fecha_desde, fecha_hasta) => {
    // Ejecutamos el procedimiento almacenado que ya creaste en Workbench
    const sql = "CALL pa_estadisticas_obras_sociales(?, ?)";

    // pool.execute usa parámetros preparados para evitar inyección SQL
    const [resultado] = await pool.execute(sql, [fecha_desde, fecha_hasta]);

    // Como es un CALL, el resultado viene en el primer índice del arreglo
    return resultado[0];
  };
}
