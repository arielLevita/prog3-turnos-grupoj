export default class MedicoCreateDto {
    constructor(object) {
        this.idUsuario = object.idUsuario ? parseInt(object.idUsuario) : null;
        this.idEspecialidad = object.idEspecialidad ? parseInt(object.idEspecialidad) : null;
        this.matricula = object.matricula ? parseInt(object.matricula) : null;
        this.descripcion = object.descripcion ? object.descripcion.trim() : null;
        this.valorConsulta = object.valorConsulta !== undefined ? parseFloat(object.valorConsulta) : 0;
        this.obrasSociales = Array.isArray(object.obrasSociales) ? object.obrasSociales : [];
    }
}