export default class ObraSocialCreateDto {
    constructor(object) {
        this.nombre = object.nombre ? object.nombre.trim().toUpperCase() : null;
        this.descripcion = object.descripcion ? object.descripcion.trim() : null;
        this.porcentajeDescuento = object.porcentajeDescuento !== undefined 
                                    ? parseFloat(object.porcentajeDescuento) 
                                    : 0;
        this.esParticular = object.esParticular ? 1 : 0;
    }
}