import pool from "../db/conexion.js";

export default class EstadisticasServicio {
  obtenerEstadisticas = async (reporte, params) => {
    let paNombre = "";

    switch (reporte) {
      case "obras-sociales":
        paNombre = "pa_estadisticas_obras_sociales";
        break;
      case "medicos":
        paNombre = "pa_estadisticas_medicos";
        break;
      case "especialidades":
        paNombre = "pa_estadisticas_especialidades";
        break;
      default:
        throw new Error("Reporte no encontrado");
    }

    const [resultados] = await pool.query(`CALL ${paNombre}(?, ?)`, params);
    return resultados[0];
  };
}
