import express from "express";
import { query, param } from "express-validator";
import validarCampos from "../../middlewares/validarCampos.js";
import EstadisticasControlador from "../../controladores/estadisticasControlador.js";

const router = express.Router();
const estadisticasControlador = new EstadisticasControlador();

router.get(
  "/:tipo",
  [
    param("tipo").notEmpty(),
    query("fecha_desde").isDate(),
    query("fecha_hasta").isDate(),
    validarCampos,
  ],
  estadisticasControlador.obtenerReporte,
);

export { router };
