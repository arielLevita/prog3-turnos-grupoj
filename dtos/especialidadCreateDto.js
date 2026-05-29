export default class EspecialidadCreateDto {
    constructor(object) {
        // Limpiamos el texto que manda el usuario
        this.nombre = object.nombre ? object.nombre.trim().toUpperCase() : null;
    }
}