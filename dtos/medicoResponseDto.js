export default class MedicoResponseDto {
    constructor(dbRow) {

        this.idMedico = dbRow.id_medico;
        this.matricula = dbRow.matricula;
        this.descripcion = dbRow.descripcion;
        this.valorConsulta = parseFloat(dbRow.valor_consulta);

        this.idUsuario = dbRow.id_usuario;
        this.apellido = dbRow.apellido;
        this.nombres = dbRow.nombres;
        this.email = dbRow.email;
        this.fotoPath = dbRow.fotoPath || dbRow.foto_path;

        this.idEspecialidad = dbRow.id_especialidad;
        this.especialidadNombre = dbRow.especialidad_nombre;
        this.obrasSociales = dbRow.obrasSociales || [];
    }
}