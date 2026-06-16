export default class PacienteResponseDto {
    constructor(dbRow) {
        this.idPaciente = dbRow.id_paciente;
        this.idUsuario = dbRow.id_usuario;
        this.idObraSocial = dbRow.id_obra_social;
        this.apellido = dbRow.apellido;
        this.nombres = dbRow.nombres;
        this.email = dbRow.email;
        this.descripcionObraSocial = dbRow.descripcion_obra_social;
        this.fotoPath = dbRow.foto_path;
    }
}