export default class EspecialidadCreateDto {
    constructor(object) {
        this.nombre = object.nombre ? object.nombre.trim().toUpperCase() : null;
    }
}