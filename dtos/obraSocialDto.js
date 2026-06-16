export default class ObraSocialDto {
    constructor(dbRow) {
        this.idObraSocial = dbRow.id_obra_social;
        this.nombre = dbRow.nombre;
        this.descripcion = dbRow.descripcion;
        this.porcentajeDescuento = parseFloat(dbRow.porcentaje_descuento);
        this.esParticular = dbRow.es_particular === 1; 
    }
}