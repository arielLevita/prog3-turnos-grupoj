export default class ObraSocialCreateDto {
    constructor(object) {
        // Limpiamos espacios y pasamos a mayúsculas el nombre
        this.nombre = object.nombre ? object.nombre.trim().toUpperCase() : null;
        
        // La descripción solo le sacamos los espacios extra de los bordes
        this.descripcion = object.descripcion ? object.descripcion.trim() : null;
        
        // Aseguramos que el descuento sea un número (si no mandan nada, es 0)
        this.porcentajeDescuento = object.porcentajeDescuento !== undefined 
                                    ? parseFloat(object.porcentajeDescuento) 
                                    : 0;
        
        // es_particular es un TINYINT(1) en la base de datos. 
        // Si el frontend manda 'true' o 1, lo guardamos como 1. Si no, como 0.
        this.esParticular = object.esParticular ? 1 : 0;
    }
}