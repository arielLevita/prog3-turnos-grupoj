export default class MedicoCreateDto {
    constructor(object) {
        // Aseguramos que los IDs y la matrícula sean números enteros
        this.idUsuario = object.idUsuario ? parseInt(object.idUsuario) : null;
        this.idEspecialidad = object.idEspecialidad ? parseInt(object.idEspecialidad) : null;
        this.matricula = object.matricula ? parseInt(object.matricula) : null;
        
        // Limpiamos la descripción
        this.descripcion = object.descripcion ? object.descripcion.trim() : null;
        
        // Aseguramos que el valor de la consulta sea un número decimal
        this.valorConsulta = object.valorConsulta !== undefined ? parseFloat(object.valorConsulta) : 0;
        
        // Recogemos el array de obras sociales (si viene, nos aseguramos que sea un array)
        this.obrasSociales = Array.isArray(object.obrasSociales) ? object.obrasSociales : [];
    }
}