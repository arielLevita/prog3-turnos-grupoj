import EstadisticasServicio from "../servicios/estadisticasServicio.js";

export default class EstadisticasControlador {
  constructor() {
    this.estadisticas = new EstadisticasServicio();
  }

  obtenerReporte = async (req, res) => {
    try {
      const { tipo } = req.params;
      const { fecha_desde, fecha_hasta, formato } = req.query;

      if (formato === 'pdf') {
        const respuestaPdf = await this.estadisticas.obtenerEstadisticasPdf(tipo, [
          fecha_desde,
          fecha_hasta,
        ]);
        
        res.set(respuestaPdf.headers);
        return res.status(200).send(respuestaPdf.buffer);
      }

      const datos = await this.estadisticas.obtenerEstadisticas(tipo, [
        fecha_desde,
        fecha_hasta,
      ]);

      if (!datos || datos.length === 0) {
        return res
          .status(404)
          .json({ estado: false, msg: "No hay datos disponibles" });
      }

      res.status(200).json(datos);
    } catch (error) {
      console.log(`Error en GET /estadisticas/${req.params.tipo}: ${error}`);
      res
        .status(500)
        .json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
