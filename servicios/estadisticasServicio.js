import pool from "../db/conexion.js";

export default class EstadisticasServicio {
  obtenerEstadisticas = async (reporte, params) => {
    let spName = "";

    switch (reporte) {
      case "obras-sociales":
        spName = "pa_estadisticas_obras_sociales";
      case "medicos":
        spName = "pa_estadisticas_medicos";
        break;
      case "especialidades":
        spName = "pa_estadisticas_especialidades";
        break;
      default:
        throw new Error("Reporte no encontrado");
    }

    const [resultados] = await pool.query(`CALL ${spName}(?, ?)`, params);
    return resultados[0];
  };
}
