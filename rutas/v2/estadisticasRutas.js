import express from "express";
import { query } from "express-validator";
import validarCampos from "../../middlewares/validarCampos.js";
import EstadisticasControlador from "../../controladores/estadisticasControlador.js";

const router = express.Router();
const estadisticasControlador = new EstadisticasControlador();

router.get(
  "/obras-sociales",
  [
    query(
      "fecha_desde",
      "La fecha de inicio es obligatoria y debe ser válida",
    ).isDate(),
    query(
      "fecha_hasta",
      "La fecha de fin es obligatoria y debe ser válida",
    ).isDate(),
    validarCampos,
  ],
  estadisticasControlador.porObraSocial,
);

export { router };
