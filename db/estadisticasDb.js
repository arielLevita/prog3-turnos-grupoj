import pool from "./conexion.js";

export default class Estadisticas {
  porObraSocial = async (fecha_desde, fecha_hasta) => {
    
    const sql = "CALL pa_estadisticas_obras_sociales(?, ?)";

    
    const [resultado] = await pool.execute(sql, [fecha_desde, fecha_hasta]);

    
    return resultado[0];
  };
}
