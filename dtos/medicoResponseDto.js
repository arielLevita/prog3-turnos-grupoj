export default class MedicoResponseDto {
    constructor(dbRow) {
        // Datos de la tabla medicos
        this.idMedico = dbRow.id_medico;
        this.matricula = dbRow.matricula;
        this.descripcion = dbRow.descripcion;
        this.valorConsulta = parseFloat(dbRow.valor_consulta);
        
        // Datos del usuario (que traemos a través de la vista v_medicos)
        this.idUsuario = dbRow.id_usuario;
        this.apellido = dbRow.apellido;
        this.nombres = dbRow.nombres;
        this.email = dbRow.email;
        
        // Datos de la especialidad (que traemos con un JOIN)
        this.idEspecialidad = dbRow.id_especialidad;
        this.especialidadNombre = dbRow.especialidad_nombre;
    }
}