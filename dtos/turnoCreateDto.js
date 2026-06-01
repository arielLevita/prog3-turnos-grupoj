export default class TurnoCreateDto {
    constructor(object) {
        this.idMedico = object.idMedico ? parseInt(object.idMedico) : null;
        this.idPaciente = object.idPaciente ? parseInt(object.idPaciente) : null;
        this.idObraSocial = object.idObraSocial ? parseInt(object.idObraSocial) : null;
        this.fechaHora = object.fechaHora ? object.fechaHora.trim() : null;
    }
}