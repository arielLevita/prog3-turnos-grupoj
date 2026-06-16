export default class MedicoObraSocialCreateDto {
    constructor(object) {
        this.idMedico = object.idMedico ? parseInt(object.idMedico) : null;
        this.idObraSocial = object.idObraSocial ? parseInt(object.idObraSocial) : null;
    }
}