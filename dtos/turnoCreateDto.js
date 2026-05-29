export default class TurnoCreateDto {
    constructor(object) {
        this.idMedico = object.idMedico ? parseInt(object.idMedico) : null;
        this.idPaciente = object.idPaciente ? parseInt(object.idPaciente) : null;
        this.idObraSocial = object.idObraSocial ? parseInt(object.idObraSocial) : null;
        
        // La fecha y hora viaja como texto ("YYYY-MM-DD HH:MM:SS")
        this.fechaHora = object.fechaHora ? object.fechaHora.trim() : null;
    }
}