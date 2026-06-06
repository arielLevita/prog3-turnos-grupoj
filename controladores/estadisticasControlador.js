import EstadisticasServicio from "../servicios/estadisticasServicio.js";

export default class EstadisticasControlador {
  constructor() {
    this.estadisticas = new EstadisticasServicio();
  }

  porObraSocial = async (req, res) => {
    try {
      const { fecha_desde, fecha_hasta } = req.query;

      const estadisticas = await this.estadisticas.porObraSocial(
        fecha_desde,
        fecha_hasta,
      );

      if (estadisticas.length === 0) {
        return res
          .status(404)
          .json({ estado: false, msg: "No hay datos en ese rango de fechas" });
      }

      res.status(200).json(estadisticas);
    } catch (error) {
      console.log(`Error en GET /estadisticas/obras-sociales ${error}`);
      res
        .status(500)
        .json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
