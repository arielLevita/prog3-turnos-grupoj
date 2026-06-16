export default class UsuarioResponseDto {
    constructor(dbRow) {
        this.idUsuario = dbRow.id_usuario;
        this.documento = dbRow.documento;
        this.apellido = dbRow.apellido;
        this.nombres = dbRow.nombres;
        this.email = dbRow.email;
        this.fotoPath = dbRow.foto_path;
        this.rol = dbRow.rol;
    }
}