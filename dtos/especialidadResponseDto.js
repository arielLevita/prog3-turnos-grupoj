export default class EspecialidadResponseDto {
    constructor(obj) {
        // Transformamos los nombres de la Base de Datos (snake_case)
        // a nombres limpios y estándar para el Frontend (camelCase).
        this.idEspecialidad = obj.id_especialidad;
        this.nombre = obj.nombre;
    }
}