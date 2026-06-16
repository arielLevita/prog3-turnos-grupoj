import pool from "../db/conexion.js";
import InformesServicio from "./informesServicio.js";

export default class EstadisticasServicio {
  constructor() {
    this.informes = new InformesServicio();
  }

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

  obtenerEstadisticasPdf = async (reporte, params) => {
    const datos = await this.obtenerEstadisticas(reporte, params);
    
    const titulos = {
      "obras-sociales": "Obras Sociales",
      "medicos": "Médicos",
      "especialidades": "Especialidades"
    };
    
    const pdf = await this.informes.generarReportePdf(datos, titulos[reporte]);
    
    return {
        buffer: pdf, 
        headers: {
            'Content-Type': 'application/pdf', 
            'Content-Disposition': `inline; filename="estadisticas_${reporte}.pdf"`
        }
    };
  };
}
