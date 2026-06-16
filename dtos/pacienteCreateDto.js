export default class PacienteCreateDto {
    constructor(object) {
        this.idUsuario = object.idUsuario ? parseInt(object.idUsuario) : null;
        this.idObraSocial = object.idObraSocial ? parseInt(object.idObraSocial) : null;
    }
}