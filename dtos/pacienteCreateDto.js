export default class PacienteCreateDto {
    constructor(object) {
        // Aseguramos que los IDs relacionales viajen como enteros nativos
        this.idUsuario = object.idUsuario ? parseInt(object.idUsuario) : null;
        this.idObraSocial = object.idObraSocial ? parseInt(object.idObraSocial) : null;
    }
}