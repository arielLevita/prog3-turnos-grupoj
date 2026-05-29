export default class ObraSocialDto {
    constructor(dbRow) {
        // Transformamos el formato de la base de datos (snake_case) a JavaScript (camelCase)
        this.idObraSocial = dbRow.id_obra_social;
        this.nombre = dbRow.nombre;
        this.descripcion = dbRow.descripcion;
        // parseFloat para asegurarnos de que el descuento viaje como un número (ej: 10.5)
        this.porcentajeDescuento = parseFloat(dbRow.porcentaje_descuento);
        // Transformamos el TINYINT (0 o 1) a un valor Booleano (false o true) para que sea más claro
        this.esParticular = dbRow.es_particular === 1; 
    }
}