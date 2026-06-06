import Estadisticas from "../db/estadisticasDb.js";

export default class EstadisticasServicio {
  constructor() {
    this.estadisticas = new Estadisticas();
  }

  porObraSocial = async (fecha_desde, fecha_hasta) => {
    return await this.estadisticas.porObraSocial(fecha_desde, fecha_hasta);
  };
}
