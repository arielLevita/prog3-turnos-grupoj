export default class MedicoPublicoResponseDto {
    constructor(data) {
        
        this.idMedico = data.idMedico || data.id_medico;
        this.apellido = data.apellido;
        this.nombres = data.nombres;
        this.idEspecialidad = data.idEspecialidad || data.id_especialidad;
        this.especialidadNombre = data.especialidadNombre || data.especialidad_nombre;

    }
}
